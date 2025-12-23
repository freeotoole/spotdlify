import React, { useEffect, useRef } from "react";
import type { Line } from "../hooks/useLogs";

import "../styles/Logger.css";
import Icon, { icons, type IconName } from "./Icon";

interface Props {
  lines: Line[];
  finished: boolean;
  error: string | null;
  // sessionId?: string | null;
  // setHasSession: React.Dispatch<React.SetStateAction<boolean>>;
  setSessionId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Logger({
  lines,
  finished,
  error,
  setSessionId,
}: Props) {
  const containerRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [lines]);

  const testIcons: IconName[] = [
    "ghost",
    "poo",
    "headphones",
    "guitar",
    "robot",
    "skull",
  ];

  const iconFills = [
    "#bfeff5",
    "#00a9e0",
    "#c9ef14",
    "#ffffff",
    "#ffc400",
    "#ff6f6f",
    "#ffc0d9",
  ];

  // stderr lines are currently unused; keep filter handy if needed later
  const streamMeta = lines.filter((l) => l.stream === "meta" && l.text.trim());
  const streamStdout = lines.filter(
    (l) => l.stream === "stdout" && l.text.trim()
  );
  const [iconList, setIconList] = React.useState<IconName[]>(["compact-disc"]);

  useEffect(() => {
    if (finished) return;

    const interval = setInterval(() => {
      setIconList((prev) => {
        const newList = [...prev, "compact-disc" as IconName];
        if (newList.length > 7) {
          newList.splice(0, 6);
        }
        return newList;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [finished]);

  return (
    <section className="logs-section">
      <header className="background-gay">
        <div className="logger-header">
          <div>
            <h2 className="font-size-lg">Ripping the dudeness...</h2>
          </div>
          <button className="close-logs" onClick={() => setSessionId(null)}>
            <Icon name="circle-xmark" size="sm" />
          </button>
        </div>
      </header>
      <div className="logs">
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
        {!finished && (
          <div className="icon-scroller">
            {iconList.map((iconName, i) => (
              <Icon
                key={i + "-" + iconName}
                fill={iconFills[i % iconFills.length]}
                name="compact-disc"
                size="sm"
              />
            ))}
          </div>
        )}
      </div>
      {finished && (
        <footer>
          <p>Process finished</p>
        </footer>
      )}
    </section>
  );
}
