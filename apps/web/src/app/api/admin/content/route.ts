import { NextRequest, NextResponse } from "next/server";
import type { AdminContentKind, AdminContentStatus } from "@genlayer-school/content";
import { requireAdminAuth } from "@/lib/backend/admin-auth";
import { validateAdminContentInput } from "@/lib/backend/admin-content-validation";
import { contentStorageDriver, listAdminContentEntries, saveAdminContentEntry } from "@/lib/backend/content-store";
import type { AdminContentInput } from "@/lib/backend/content-store-types";

function isContentKind(value: unknown): value is AdminContentKind {
  return value === "weekly" || value === "spotlight" || value === "regional";
}

function isContentStatus(value: unknown): value is AdminContentStatus {
  return value === "draft" || value === "published";
}

export async function GET(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  const entries = await listAdminContentEntries();
  return NextResponse.json({ storageDriver: contentStorageDriver, entries });
}

export async function POST(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  const body = await request.json() as Partial<AdminContentInput>;
  if (!isContentKind(body.kind)) {
    return NextResponse.json({ error: "kind must be weekly, spotlight, or regional." }, { status: 400 });
  }
  if (!isContentStatus(body.status)) {
    return NextResponse.json({ error: "status must be draft or published." }, { status: 400 });
  }

  const input = body as AdminContentInput;
  const payloadError = validateAdminContentInput(input);
  if (payloadError) return NextResponse.json({ error: payloadError }, { status: 400 });

  try {
    const entry = await saveAdminContentEntry(input);
    return NextResponse.json({ storageDriver: contentStorageDriver, entry });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save admin content.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
