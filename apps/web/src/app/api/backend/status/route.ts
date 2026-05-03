import { NextResponse } from "next/server";
import { storageDriver } from "@/lib/backend/progress-store";

export async function GET() {
  return NextResponse.json({
    storageDriver,
    supabaseConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    privyConfigured: Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID),
    privyServerVerificationConfigured: Boolean((process.env.PRIVY_APP_ID || process.env.NEXT_PUBLIC_PRIVY_APP_ID) && process.env.PRIVY_VERIFICATION_KEY),
    privyAuthRequired: process.env.PRIVY_AUTH_REQUIRED === "true",
  });
}
