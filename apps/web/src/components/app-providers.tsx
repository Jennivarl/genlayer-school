"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";

type PrivyLoginMethod = "email" | "wallet" | "google" | "github";

type AuthContextValue = {
  configured: boolean;
  ready: boolean;
  authenticated: boolean;
  learnerId: string;
  label: string;
  displayName: string | null;
  email: string | null;
  walletAddress: string | null;
  login: () => void;
  logout: () => void;
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

const DEFAULT_LEARNER_ID = "demo-learner";
const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const privyClientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;
const supportedLoginMethods = new Set<PrivyLoginMethod>(["email", "wallet", "google", "github"]);

function getPrivyLoginMethods(): PrivyLoginMethod[] {
  const raw = process.env.NEXT_PUBLIC_PRIVY_LOGIN_METHODS;
  const methods = raw
    ?.split(",")
    .map((method) => method.trim().toLowerCase())
    .filter((method): method is PrivyLoginMethod => supportedLoginMethods.has(method as PrivyLoginMethod));

  return methods?.length ? methods : ["email", "wallet"];
}

const DevAuthContext: AuthContextValue = {
  configured: false,
  ready: true,
  authenticated: false,
  learnerId: DEFAULT_LEARNER_ID,
  label: "Demo learner",
  displayName: null,
  email: null,
  walletAddress: null,
  login: () => undefined,
  logout: () => undefined,
  authFetch: (input, init) => fetch(input, init),
};

const AuthContext = createContext<AuthContextValue>(DevAuthContext);

function getUserLabel(user: ReturnType<typeof usePrivy>["user"]): string {
  return user?.email?.address ?? user?.wallet?.address ?? user?.id ?? "Signed in";
}

function PrivyAuthBridge({ children }: { children: ReactNode }) {
  const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy();
  const learnerId = user?.id ? `privy:${user.id}` : DEFAULT_LEARNER_ID;
  const email = user?.email?.address ?? null;
  const walletAddress = user?.wallet?.address ?? null;
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!authenticated) { setDisplayName(null); return; }
    const run = async () => {
      try {
        const headers = new Headers();
        const token = await getAccessToken();
        if (token) headers.set("Authorization", `Bearer ${token}`);
        const r = await fetch("/api/profile", { headers });
        const d = await r.json();
        const p = d.profile;
        if (p?.displayName) setDisplayName(p.displayName);
        else if (p?.username) setDisplayName(p.username);
      } catch {}
    };
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, learnerId]);

  const value: AuthContextValue = {
    configured: true,
    ready,
    authenticated,
    learnerId,
    label: authenticated ? getUserLabel(user) : "Sign in",
    displayName,
    email,
    walletAddress,
    login: () => { void login(); },
    logout: () => { void logout(); },
    authFetch: async (input, init) => {
      const headers = new Headers(init?.headers);
      const accessToken = await getAccessToken();
      if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
      return fetch(input, { ...init, headers });
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  if (!privyAppId) {
    return <AuthContext.Provider value={DevAuthContext}>{children}</AuthContext.Provider>;
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      clientId={privyClientId}
      config={{
        loginMethods: getPrivyLoginMethods(),
        appearance: {
          theme: "dark",
          accentColor: "#7ee787",
          showWalletLoginFirst: true,
        },
        embeddedWallets: {
          ethereum: { createOnLogin: "users-without-wallets" },
        },
      }}
    >
      <PrivyAuthBridge>{children}</PrivyAuthBridge>
    </PrivyProvider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
