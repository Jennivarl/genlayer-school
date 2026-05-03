"use client";

import { useAuth } from "./app-providers";

export function AuthStatus() {
  const auth = useAuth();

  if (!auth.configured) {
    return <span className="auth-pill muted">Privy not configured</span>;
  }

  if (!auth.ready) {
    return <span className="auth-pill muted">Loading auth</span>;
  }

  if (!auth.authenticated) {
    return (
      <button className="auth-pill" type="button" onClick={auth.login}>
        Sign in
      </button>
    );
  }

  return (
    <div className="auth-cluster">
      <span className="auth-pill muted">{auth.label}</span>
      <button className="auth-pill" type="button" onClick={auth.logout}>
        Sign out
      </button>
    </div>
  );
}
