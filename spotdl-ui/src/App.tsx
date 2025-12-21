import React, { useState } from "react";
import "./App.css";
import { useLogs } from "./hooks/useLogs";

import Form from "./components/Form";
import Logger from "./components/Logger";

import mockResponse from "./mockResponse.json";

function App() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  let { lines, finished, error } = useLogs(sessionId);
  // const { lines, finished, error } = mockResponse;

  // const [hasSession, setHasSession] = useState(false);
  // create array of icons to randomly choose from
  // start a download for the given Spotify URL (called from <Form />)
  const handleStart = async (url: string) => {
    if (!url || !url.trim()) return;
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
        console.log("[App] got session id", data.id);
      } else if (!res.ok) {
        setStatus(`Error: ${data.error || data.status}`);
      } else {
        setStatus("Download finished");
      }
    } catch (err: any) {
      setStatus("Request failed");
    } finally {
      setLoading(false);
    }
  };

  // auto-scroll to bottom when new logs arrive
  // useEffect(() => {
  //   const el = containerRef.current;
  //   if (el) {
  //     el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  //   }
  // }, [lines]);

  // const mockIt = () => {
  //   setSessionId("cba6df64-dd7e-48a3-9b0d-8482674f2792");
  //   lines = mockResponse.lines;
  //   finished = mockResponse.finished;
  //   error = mockResponse.error;
  // };

  const bbMessages = {
    loading: "Processing your request...",
    finished: "All done! Check your downloads folder.",
    error: "An error occurred. Please try again.",
  };

  return (
    <div className="App">
      {!sessionId ? (
        <Form onSubmit={handleStart} loading={loading} />
      ) : (
        <Logger
          lines={lines}
          finished={finished}
          error={error}
          setSessionId={setSessionId}
        />
      )}
    </div>
  );
}

export default App;
