import { NextRequest, NextResponse } from "next/server";
import { PrivyClient, verifyAccessToken } from "@privy-io/node";
import { normalizeLearnerId } from "./progress-store";

type LearnerAuthResult = {
  learnerId: string;
  authenticated: boolean;
  privyUserId?: string;
};

const DEMO_LEARNER_ID = "demo-learner";

let cachedPrivyClient:
  | {
      appId: string;
      appSecret: string;
      verificationKey?: string;
      client: PrivyClient;
    }
  | undefined;

function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (header?.toLowerCase().startsWith("bearer ")) {
    return header.slice("bearer ".length).trim();
  }
  return request.cookies.get("privy-token")?.value ?? null;
}

function getPrivyAppId(): string | undefined {
  return process.env.PRIVY_APP_ID || process.env.NEXT_PUBLIC_PRIVY_APP_ID;
}

function getPrivyServerCredential(): { appSecret?: string; verificationKey?: string } {
  return {
    appSecret: process.env.PRIVY_APP_SECRET,
    verificationKey: process.env.PRIVY_VERIFICATION_KEY,
  };
}

function getPrivyClient(appId: string, appSecret: string, verificationKey?: string): PrivyClient {
  if (
    cachedPrivyClient?.appId !== appId ||
    cachedPrivyClient.appSecret !== appSecret ||
    cachedPrivyClient.verificationKey !== verificationKey
  ) {
    cachedPrivyClient = {
      appId,
      appSecret,
      verificationKey,
      client: new PrivyClient({
        appId,
        appSecret,
        jwtVerificationKey: verificationKey,
      }),
    };
  }

  return cachedPrivyClient.client;
}

function isAuthRequired(): boolean {
  return process.env.PRIVY_AUTH_REQUIRED === "true";
}

export async function resolveLearnerAuth(
  request: NextRequest,
  fallbackLearnerId?: string | null,
): Promise<LearnerAuthResult | NextResponse> {
  const token = getBearerToken(request);
  const appId = getPrivyAppId();
  const { appSecret, verificationKey } = getPrivyServerCredential();

  if (!token) {
    if (isAuthRequired()) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    return {
      learnerId: normalizeLearnerId(fallbackLearnerId ?? DEMO_LEARNER_ID),
      authenticated: false,
    };
  }

  if (!appId || (!appSecret && !verificationKey)) {
    return NextResponse.json(
      { error: "Privy server verification is not configured." },
      { status: 500 },
    );
  }

  try {
    const verified = appSecret
      ? await getPrivyClient(appId, appSecret, verificationKey).utils().auth().verifyAccessToken(token)
      : await verifyAccessToken({
          access_token: token,
          app_id: appId,
          verification_key: verificationKey!,
        });

    return {
      learnerId: `privy:${verified.user_id}`,
      authenticated: true,
      privyUserId: verified.user_id,
    };
  } catch {
    return NextResponse.json({ error: "Invalid Privy access token." }, { status: 401 });
  }
}

export function isAuthError(result: LearnerAuthResult | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}
