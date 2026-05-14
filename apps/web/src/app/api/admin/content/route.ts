import { NextRequest, NextResponse } from "next/server";
import type { AdminContentKind, AdminContentStatus } from "@genlayer-school/content";
import { requireAdminAuth } from "@/lib/backend/admin-auth";
import { contentStorageDriver, listAdminContentEntries, saveAdminContentEntry } from "@/lib/backend/content-store";
import type { AdminContentInput } from "@/lib/backend/content-store-types";

function isContentKind(value: unknown): value is AdminContentKind {
  return value === "weekly" || value === "spotlight" || value === "regional";
}

function isContentStatus(value: unknown): value is AdminContentStatus {
  return value === "draft" || value === "published";
}

function validatePayload(input: AdminContentInput): string | null {
  if (!input.payload || typeof input.payload !== "object") return "payload is required.";
  if (!("slug" in input.payload) || typeof input.payload.slug !== "string" || !input.payload.slug.trim()) return "payload.slug is required.";
  if (!("title" in input.payload) || typeof input.payload.title !== "string" || !input.payload.title.trim()) return "payload.title is required.";
  if (input.kind === "weekly" && (!("quiz" in input.payload) || !input.payload.quiz)) return "weekly payload.quiz is required.";
  if (input.kind === "spotlight" && (!("featuredBuilder" in input.payload) || !input.payload.featuredBuilder)) return "spotlight payload.featuredBuilder is required.";
  if (input.kind === "regional" && (!("lessons" in input.payload) || !("quiz" in input.payload))) return "regional payload.lessons and payload.quiz are required.";
  return null;
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
  const payloadError = validatePayload(input);
  if (payloadError) return NextResponse.json({ error: payloadError }, { status: 400 });

  try {
    const entry = await saveAdminContentEntry(input);
    return NextResponse.json({ storageDriver: contentStorageDriver, entry });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save admin content.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
