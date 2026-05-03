import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@privy-io/node";
import { normalizeLearnerId } from "./progress-store";

type LearnerAuthResult = {
  learnerId: string;
  authenticated: boolean;
  privyUserId?: string;
};

const DEMO_LEARNER_ID = "demo-learner";

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

function isAuthRequired(): boolean {
  return process.env.PRIVY_AUTH_REQUIRED === "true";
}

export async function resolveLearnerAuth(
  request: NextRequest,
  fallbackLearnerId?: string | null,
): Promise<LearnerAuthResult | NextResponse> {
  const token = getBearerToken(request);
  const appId = getPrivyAppId();
  const verificationKey = process.env.PRIVY_VERIFICATION_KEY;

  if (!token) {
    if (isAuthRequired()) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    return {
      learnerId: normalizeLearnerId(fallbackLearnerId ?? DEMO_LEARNER_ID),
      authenticated: false,
    };
  }

  if (!appId || !verificationKey) {
    return NextResponse.json(
      { error: "Privy server verification is not configured." },
      { status: 500 },
    );
  }

  try {
    const verified = await verifyAccessToken({
      access_token: token,
      app_id: appId,
      verification_key: verificationKey,
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
