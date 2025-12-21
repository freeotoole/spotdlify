import React, { useState } from "react";

import Icon from "./Icon";

interface Props {
  onSubmit: (url: string) => void | Promise<void>;
  loading?: boolean;
}

export default function Form({ onSubmit, loading }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
  };

  return (
    <section className="downloader">
      <form className="form-backdrop" onSubmit={handleSubmit}>
        <h1>Tune Hunter</h1>
        <textarea
          className="spotify-url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste your Spotify URL here my dude..."
          rows={3}
          // submit on enter
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSubmit(e);
            }
          }}
        />
      </form>
      <div className="button-wrapper">
        <button
          type="submit"
          disabled={loading}
          className={loading ? "gay" : ""}
        >
          <span className="button-text">
            {loading ? "Ripping..." : "Rip it!"}
          </span>
          <span className="button-icon">
            <Icon name="spotify" fill="var(--color-spotify)" />
          </span>
        </button>
      </div>
    </section>
  );
}
