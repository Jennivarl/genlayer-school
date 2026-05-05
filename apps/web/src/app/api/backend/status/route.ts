import { NextResponse } from "next/server";
import { getBackendDiagnostics } from "@/lib/backend/diagnostics";

export async function GET() {
  return NextResponse.json(getBackendDiagnostics());
}
