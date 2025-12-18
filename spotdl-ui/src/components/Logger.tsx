import React, { useEffect, useRef } from "react";
import type { Line } from "../hooks/useLogs";

import "../styles/Logger.css";

interface Props {
  lines: Line[];
  finished: boolean;
  error: string | null;
  sessionId?: string | null;
}

export default function Logger({ lines, finished, error }: Props) {
  const containerRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [lines]);

  const streamErrors = lines.filter(
    (l) => l.stream === "stderr" && l.text.trim()
  );
  const streamMeta = lines.filter((l) => l.stream === "meta" && l.text.trim());
  const streamStdout = lines.filter(
    (l) => l.stream === "stdout" && l.text.trim()
  );

  return (
    <section className="logs-section">
      <div className="container-xl">
        <button className="close-logs">x</button>
        <h2 className="font-size-xl">Rip it my dude!</h2>
        <div
          className="flex"
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--spacing-sm)",
          }}
        ></div>

        <div className="logs-section">
          {streamMeta && (
            <p style={{ color: "orange", marginTop: "var(--spacing-md)" }}>
              {streamMeta.map((m) => m.text).join("\n")}
            </p>
          )}
          <ul ref={containerRef} className="logger">
            {streamStdout.map((l, i) => (
              <li key={i}>{l.text}</li>
            ))}
          </ul>
          {error && (
            <p style={{ color: "tomato", marginTop: "var(--spacing-md)" }}>
              {error}
            </p>
          )}

          {finished && (
            <p style={{ color: "#a3f7b5", marginTop: "var(--spacing-md)" }}>
              Process finished
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
