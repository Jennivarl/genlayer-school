"use client";

import { createContext, useContext, type ReactNode } from "react";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";

type AuthContextValue = {
  configured: boolean;
  ready: boolean;
  authenticated: boolean;
  learnerId: string;
  label: string;
  login: () => void;
  logout: () => void;
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

const DEFAULT_LEARNER_ID = "demo-learner";
const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const privyClientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;

const DevAuthContext: AuthContextValue = {
  configured: false,
  ready: true,
  authenticated: false,
  learnerId: DEFAULT_LEARNER_ID,
  label: "Demo learner",
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

  const value: AuthContextValue = {
    configured: true,
    ready,
    authenticated,
    learnerId,
    label: authenticated ? getUserLabel(user) : "Sign in",
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
        loginMethods: ["wallet", "email", "google", "github"],
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
