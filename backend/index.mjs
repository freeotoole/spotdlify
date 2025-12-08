import express from "express";
import cors from "cors";
import { spawn } from "child_process";

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

// Trigger download
app.post("/api/download", (req, res) => {
  const { url } = req.body || {};

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'url' field" });
  }

  // Log for your own sanity
  // console.log(`[spotifarr] Download requested: ${url}`);

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

  const child = spawn("docker", args);

  let stdout = "";
  let stderr = "";

  child.stdout.on("data", (data) => {
    const text = data.toString();
    stdout += text;
    process.stdout.write(text); // stream to backend logs
  });

  child.stderr.on("data", (data) => {
    const text = data.toString();
    stderr += text;
    process.stderr.write(text); // stream to backend logs
  });

  child.on("close", (code) => {
    if (code === 0) {
      console.log(`[spotifarr] Download finished for ${url}`);
      return res.json({
        status: "ok",
        code,
        stdout,
      });
    } else {
      console.error(`[spotifarr] Download failed for ${url} (exit code ${code})`);
      return res.status(500).json({
        status: "error",
        code,
        stderr,
      });
    }
  });

  child.on("error", (err) => {
    console.error("[spotifarr] Failed to start docker exec:", err);
    return res.status(500).json({
      status: "error",
      message: "Failed to start docker exec",
    });
  });
});

app.listen(PORT, () => {
  console.log(`spotifarr backend listening on http://localhost:${PORT}`);
  console.log(`Using container: ${SPOTDL_CONTAINER}`);
});
