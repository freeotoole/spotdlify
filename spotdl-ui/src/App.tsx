import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [logs, setLogs] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setStatus(null);
    setLogs(null);

    try {
      const res = await fetch("http://localhost:4000/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(`Error: ${data.error || data.status}`);
        setLogs(data.stderr || "");
      } else {
        setStatus("Download started / finished");
        setLogs(data.stdout || "");
      }
    } catch (err: any) {
      setStatus("Request failed");
      setLogs(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("status", status);
    console.log("logs", logs);
  }, [status, logs]);

  return (
    <div className="App">
      <header className="App-header">
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

        {status && <p className="status">{status}</p>}
      </header>
    </div>
  );
}

export default App;
