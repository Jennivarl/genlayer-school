import { NextResponse } from "next/server";
import { getCommunityMembers } from "@/lib/backend/progress-store";

export async function GET() {
  const members = await getCommunityMembers();
  return NextResponse.json({ members });
}
