"use client";

import { useEffect, useState } from "react";
import type { LearnerProfile } from "@genlayer-school/content";
import { useAuth } from "./app-providers";

type ProfileResponse = {
  profile?: LearnerProfile;
  error?: string;
};

export function UsernameForm() {
  const auth = useAuth();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const response = await auth.authFetch("/api/profile");
      const data = await response.json() as ProfileResponse;
      if (cancelled || !data.profile) return;
      setProfile(data.profile);
      setUsername(data.profile.username ?? "");
      setDisplayName(data.profile.displayName ?? "");
    }

    if (auth.ready) void loadProfile();

    return () => { cancelled = true; };
  }, [auth]);

  async function saveProfile() {
    setSaving(true);
    setStatus(null);
    const response = await auth.authFetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, displayName }),
    });
    const data = await response.json() as ProfileResponse;

    if (!response.ok) {
      setStatus(data.error ?? "Could not save username.");
    } else if (data.profile) {
      setProfile(data.profile);
      setUsername(data.profile.username ?? "");
      setDisplayName(data.profile.displayName ?? "");
      setStatus("Profile saved.");
    }

    setSaving(false);
  }

  return (
    <article className="card">
      <p className="meta">Learner identity</p>
      <h2>Username</h2>
      <p>Choose a public handle for leaderboards, certificates, and community activity.</p>
      <div className="form-grid">
        <label>
          <span>Username</span>
          <input
            autoComplete="username"
            maxLength={24}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="gen_fren"
            value={username}
          />
        </label>
        <label>
          <span>Display name</span>
          <input
            maxLength={48}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="GenLayer learner"
            value={displayName}
          />
        </label>
      </div>
      <div className="cta-row">
        <button className="button" disabled={saving || !auth.ready} onClick={saveProfile} type="button">
          {saving ? "Saving" : "Save profile"}
        </button>
        <span className="pill">{profile?.username ? `@${profile.username}` : "No username yet"}</span>
      </div>
      {status && <p className="meta">{status}</p>}
    </article>
  );
}
