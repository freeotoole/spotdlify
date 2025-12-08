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
        <p>Paste link to Spotify song/album/playlist to download</p>

        <form className="ripper" onSubmit={handleSubmit}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Downloading..." : "Download"}
          </button>
        </form>
      </header>
    </div>
  );
}

export default App;
