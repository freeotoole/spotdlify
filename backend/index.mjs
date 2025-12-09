import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import { EventEmitter } from "events";
import { randomUUID } from "crypto";

const app = express();

// Config – tweak these if needed
const PORT = process.env.PORT || 4000;
const SPOTDL_CONTAINER = process.env.SPOTDL_CONTAINER || "spotdl-dev";
const OUTPUT_DIR = process.env.SPOTDL_OUTPUT_DIR || "/music";

// Middlewares
app.use(cors({
  origin: "*", // you can lock this down later to your React dev origin
}));
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", container: SPOTDL_CONTAINER });
});

// In-memory sessions for streaming logs (SSE). Each session stores an
// EventEmitter and a small buffer of recent messages so late-connecting
// clients can receive recent history.
const sessions = new Map();

function createSession() {
  const id = randomUUID();
  const emitter = new EventEmitter();
  const buffer = [];
  const session = { emitter, buffer };
  sessions.set(id, session);
  return { id, session };
}

function destroySession(id) {
  const s = sessions.get(id);
  if (s) {
    s.emitter.removeAllListeners();
    sessions.delete(id);
  }
}

// SSE endpoint: clients connect to receive real-time log events for a session
app.get('/api/logs/:id', (req, res) => {
  const { id } = req.params;
  const session = sessions.get(id);
  if (!session) {
    return res.status(404).json({ error: 'Unknown session id' });
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders && res.flushHeaders();

  // Helper to send SSE messages
  const send = (event, data) => {
    res.write(`event: ${event}\n`);
    // Ensure data is single-line per SSE spec chunking
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    res.write(`data: ${payload.replace(/\n/g, '\\n')}\n\n`);
  };

  // Send buffered messages first
  for (const msg of session.buffer) {
    send('log', msg);
  }

  // Register listener
  const onLog = (msg) => send('log', msg);
  const onEnd = (info) => {
    send('end', info);
    res.end();
  };
  session.emitter.on('log', onLog);
  session.emitter.once('end', onEnd);

  // Clean up when client disconnects
  req.on('close', () => {
    session.emitter.removeListener('log', onLog);
  });
});

// Trigger download
app.post("/api/download", (req, res) => {
  const { url } = req.body || {};

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'url' field" });
  }

  // Create a session for streaming logs and return its id immediately.
  const { id, session } = createSession();
  // Keep a small buffer of recent messages (already in session.buffer)
  const pushToBuffer = (msg) => {
    session.buffer.push(msg);
    // limit buffer to last 200 messages
    if (session.buffer.length > 200) session.buffer.shift();
  };

  // Return the session id immediately so the client can connect via SSE
  res.status(202).json({ status: 'accepted', id });


  // Use spawn with args array to avoid shell injection
  const args = [
    "exec",
    SPOTDL_CONTAINER,
    "spotdl",
    "download",
    url,
    "--output",
    OUTPUT_DIR,
  ];

  console.log(`[spotifarr] Download script: ${args}`);

  const child = spawn("docker", args);

  let stdout = "";
  let stderr = "";

  child.stdout.on("data", (data) => {
    const text = data.toString();
    stdout += text;
    process.stdout.write(text); // stream to backend logs
    const msg = { stream: 'stdout', text };
    pushToBuffer(msg);
    session.emitter.emit('log', msg);
  });

  child.stderr.on("data", (data) => {
    const text = data.toString();
    stderr += text;
    process.stderr.write(text); // stream to backend logs
    const msg = { stream: 'stderr', text };
    pushToBuffer(msg);
    session.emitter.emit('log', msg);
  });

  child.on("close", (code) => {
    const info = { code };
    if (code === 0) {
      console.log(`[spotifarr] Download finished for ${url}`);
      session.emitter.emit('end', { success: true, ...info, url });
    } else {
      console.error(`[spotifarr] Download failed for ${url} (exit code ${code})`);
      session.emitter.emit('end', { success: false, ...info, stderr, url });
    }
    // schedule session cleanup
    setTimeout(() => destroySession(id), 30_000);
  });

  child.on("error", (err) => {
    console.error("[spotifarr] Failed to start docker exec:", err);
    session.emitter.emit('end', { success: false, error: String(err), url });
    setTimeout(() => destroySession(id), 30_000);
  });
});

app.listen(PORT, () => {
  console.log(`spotifarr backend listening on http://localhost:${PORT}`);
  console.log(`Using container: ${SPOTDL_CONTAINER}`);
});
