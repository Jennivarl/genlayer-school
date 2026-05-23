import { NextRequest, NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/backend/progress-store";
import { isAuthError, resolveLearnerAuth } from "@/lib/backend/auth";

type ProfilePayload = {
  learnerId?: string;
  username?: string | null;
  displayName?: string | null;
  walletAddress?: string | null;
  email?: string | null;
  pfpUrl?: string | null;
};

function toErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Profile update failed.";
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const fallbackLearnerId = request.nextUrl.searchParams.get("learnerId");
  const auth = await resolveLearnerAuth(request, fallbackLearnerId);
  if (isAuthError(auth)) return auth;

  const profile = await getProfile(auth.learnerId);
  return NextResponse.json({ auth, profile });
}

export async function PATCH(request: NextRequest) {
  const payload = (await request.json()) as ProfilePayload;
  const auth = await resolveLearnerAuth(request, payload.learnerId);
  if (isAuthError(auth)) return auth;

  try {
    const profile = await updateProfile({
      learnerId: auth.learnerId,
      username: payload.username,
      displayName: payload.displayName,
      walletAddress: payload.walletAddress,
      email: payload.email,
      pfpUrl: payload.pfpUrl,
    });

    return NextResponse.json({ auth, profile });
  } catch (error) {
    return toErrorResponse(error);
  }
}
