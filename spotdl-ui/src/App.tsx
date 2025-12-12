import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { useLogs } from "./hooks/useLogs";

import { ReactComponent as SpotifyIcon } from "./assets/icons/spotify-brands-solid-full.svg";
import { ReactComponent as PooIcon } from "./assets/icons/poo-solid-full.svg";
import { ReactComponent as BombIcon } from "./assets/icons/bomb-solid-full.svg";
import { ReactComponent as SkullIcon } from "./assets/icons/skull-solid-full.svg";

function App() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const containerRef = useRef<HTMLUListElement | null>(null);

  // const { lines, finished, error } = mockResponse;
  const { lines, finished, error } = useLogs(sessionId);

  // create array of icons to randomly choose from
  const icons = [
    <PooIcon className="icon" />,
    <BombIcon className="icon" />,
    <SkullIcon className="icon" />,
  ];

  const iconColours = ["#53410e", "black", "white"];
  const switchIcon = () => {
    // change to a random icon index
    let newIndex = Math.floor(Math.random() * icons.length);
    while (newIndex === iconIndex) {
      newIndex = Math.floor(Math.random() * icons.length);
    }
    setIconIndex(newIndex);
  };

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
        // setStatus("🏴‍☠️ Hacking the narr...");
        setSessionId(data.id);
        // also log and surface the id so we can debug
        console.log("[App] got session id", data.id);
      } else if (!res.ok) {
        setStatus(`Error: ${data.error || data.status}`);
      } else {
        // fallback: older backend responses
        console.log("Status: Download finished");
        setStatus("Download finished");
      }
    } catch (err: any) {
      setStatus("Request failed");
    } finally {
      // setLoading(false);
      console.log("Status: All done yo");
      switchIcon();
    }
  };

  // useEffect(() => {
  //   console.log({ lines, finished, error });
  // }, [lines, finished, error]);

  // auto-scroll to bottom when new logs arrive
  // useEffect(() => {
  //   const el = containerRef.current;
  //   if (el) {
  //     el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  //   }
  // }, [lines]);

  const [iconIndex, setIconIndex] = useState(0);

  const bbMessages = {
    loading: "Processing your request...",
    finished: "All done! Check your downloads folder.",
    error: "An error occurred. Please try again.",
  };

  return (
    <div className="App">
      <div className="container flex column gap-xl">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1>Paste link to Spotify song/album/playlist to download in MP3</h1>

        <form className="form-backdrop" onSubmit={handleSubmit}>
          <textarea
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your Spotify URL here my dude..."
            rows={3}
          />
          <p className="button-wrapper">
            <button
              type="submit"
              disabled={loading}
              className={loading ? "gay" : ""}
            >
              <span className="button-text">
                {loading ? "Ripping..." : "RIP IT!"}
              </span>
              <span
                className="button-icon"
                style={{
                  color: loading
                    ? iconColours[iconIndex]
                    : "var(--color-spotify)",
                }}
              >
                {!loading ? (
                  <SpotifyIcon
                    className="icon"
                    style={{
                      fill: "var(--color-spotify)",
                    }}
                  />
                ) : (
                  icons[iconIndex]
                )}
              </span>
            </button>
          </p>
        </form>
        {/* TODO: add the ripping, finished etc messaging */}
      </div>
      <section className="logs-section">
        <div className="container-xl">
          {loading && <p>{bbMessages.loading}</p>}
          {sessionId && (
            <ul className="logs" ref={containerRef} style={{}}>
              {lines
                .filter((l) => l.stream === "stdout" && l.text.trim())
                .map((l, i) => (
                  <li key={i}>{l.text}</li>
                ))}
            </ul>
          )}
          {error && <div style={{ color: "tomato" }}>{error}</div>}
        </div>
      </section>
    </div>
  );
}

export default App;
