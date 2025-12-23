import React, { useState } from "react";

import Icon, { type IconName } from "./Icon";

interface Props {
  onSubmit: (url: string) => void | Promise<void>;
  loading?: boolean;
}

export default function Form({ onSubmit, loading }: Props) {
  const [value, setValue] = useState("");
  const disabled = value.trim().length === 0;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    onSubmit(value.trim());
  };
  const [iconIndex, setIconIndex] = useState(0);

  // create array of icons to randomly choose from
  const icons: IconName[] = [
    "ghost",
    "poo",
    "headphones",
    "guitar",
    "robot",
    "skull",
  ];

  const iconColours = [
    "#fff",
    "saddlebrown",
    "black",
    "purple",
    "#eee",
    "#fff",
  ];
  const switchIcon = () => {
    // change to a random icon index
    let newIndex = Math.floor(Math.random() * icons.length);
    while (newIndex === iconIndex) {
      newIndex = Math.floor(Math.random() * icons.length);
    }
    setIconIndex(newIndex);
  };

  return (
    <section className="downloader">
      <form className="form-backdrop" onSubmit={handleSubmit}>
        <h1>MP3 Hunter</h1>
        <textarea
          className="spotify-url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste your Spotify URL here my dude..."
          rows={3}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSubmit(e);
            }
          }}
          // update icon every time user types
          onInput={switchIcon}
        />
      </form>
      <div className="button-wrapper">
        <button
          type="submit"
          disabled={disabled}
          className={!disabled ? "gay" : ""}
        >
          <span className="button-text">
            {disabled ? "Download" : "Rip it!"}
          </span>
          <span className="button-icon">
            {disabled ? (
              <Icon name="spotify" fill="var(--color-spotify)" />
            ) : (
              <Icon name={icons[iconIndex]} fill={iconColours[iconIndex]} />
            )}
          </span>
        </button>
      </div>
    </section>
  );
}
