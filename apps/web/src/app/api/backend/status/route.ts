import { NextResponse } from "next/server";
import { storageDriver } from "@/lib/backend/progress-store";

export async function GET() {
  return NextResponse.json({
    storageDriver,
    supabaseConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
  });
}
