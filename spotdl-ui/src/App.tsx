import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useLogs } from "./hooks/useLogs";

function App() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const containerRef = useRef<HTMLUListElement | null>(null);
  const mockResponse = {
    lines: [
      {
        stream: "stdout",
        text: "Processing query:                                                               \nhttps://open.spotify.com/playlist/6fjOnyqUZ6foGNVY8Ye0yQ?si=6fb1eaeb256c4532    \n",
      },
      {
        stream: "stdout",
        text: "Found 5 songs in Dubstep (Playlist)                                             \n",
      },
      {
        stream: "stdout",
        text: "Skipping Excision - Existence - VIP (file already exists) (duplicate)           \n",
      },
      {
        stream: "stdout",
        text: "Skipping Excision - Not Enough (file already exists) (duplicate)                \n",
      },
      {
        stream: "stdout",
        text: "Skipping Excision - Blue Steel (file already exists) (duplicate)                \n",
      },
      {
        stream: "stdout",
        text: "Skipping Excision - 2005 (file already exists) (duplicate)                      \n",
      },
      {
        stream: "stdout",
        text: "Skipping Excision - Bonebreaker (file already exists) (duplicate)               \n",
      },
      {
        stream: "stdout",
        text: "\n",
      },
      {
        stream: "meta",
        text: 'Finished: {"success":true,"code":0,"url":"https://open.spotify.com/playlist/6fjOnyqUZ6foGNVY8Ye0yQ?si=6fb1eaeb256c4532"}',
      },
    ],
    finished: true,
    error: null,
  };
  const { lines, finished, error } = mockResponse;
  // const { lines, finished, error } = useLogs(sessionId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setStatus(null);
    setSessionId(null);

    try {
      const res = await fetch("http://localhost:4000/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      console.log("[App] download response", res.status, data);

      if (res.status === 202 && data.id) {
        setStatus("Streaming logs...");
        setSessionId(data.id);
        // also log and surface the id so we can debug
        console.log("[App] got session id", data.id);
      } else if (!res.ok) {
        setStatus(`Error: ${data.error || data.status}`);
      } else {
        // fallback: older backend responses
        setStatus("Download finished");
      }
    } catch (err: any) {
      setStatus("Request failed");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   console.log({ lines, finished, error });
  // }, [lines, finished, error]);

  // auto-scroll to bottom when new logs arrive
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [lines]);

  return (
    <div className="App">
      <header className="container-">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>Paste link to Spotify song/album/playlist to download in MP3</p>

        <form className="ripper" onSubmit={handleSubmit}>
          <textarea
            className="spotify-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your Spotify URL here my dude..."
            rows={3}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Ripping..." : "Rip it!"}
          </button>
        </form>

        {/* {status && <p className="status">{status}</p>} */}
      </header>
      {sessionId ||
        (mockResponse && (
          <section className="logs-section">
            <div className="container-xl">
              <ul className="logs" ref={containerRef} style={{}}>
                {lines
                  .filter((l) => l.stream === "stdout" && l.text.trim())
                  .map((l, i) => (
                    <li key={i}>{l.text}</li>
                  ))}
              </ul>
              {error && <div style={{ color: "tomato" }}>{error}</div>}
              {finished && (
                <div style={{ color: "#a3f7b5" }}>Process finished</div>
              )}
            </div>
          </section>
        ))}
    </div>
  );
}

export default App;
