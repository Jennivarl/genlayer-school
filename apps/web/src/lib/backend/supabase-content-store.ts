import { createClient } from "@supabase/supabase-js";
import type { AdminContentEntry, AdminContentKind, AdminContentPayload, AdminContentStatus } from "@genlayer-school/content";
import type { AdminContentInput, ContentStore } from "./content-store-types";

type SupabaseConfig = {
  url: string;
  serviceRoleKey: string;
};

type AdminContentRow = {
  id: string;
  kind: AdminContentKind;
  slug: string;
  title: string;
  status: AdminContentStatus;
  payload: AdminContentPayload;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

function toEntry(row: AdminContentRow): AdminContentEntry {
  return {
    id: row.id,
    kind: row.kind,
    slug: row.slug,
    title: row.title,
    status: row.status,
    payload: row.payload,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  };
}

export function createSupabaseContentStore(config: SupabaseConfig): ContentStore {
  const supabase = createClient(config.url, config.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  async function listEntries(): Promise<AdminContentEntry[]> {
    const { data, error } = await supabase
      .from("admin_content_entries")
      .select("id, kind, slug, title, status, payload, created_at, updated_at, published_at")
      .order("updated_at", { ascending: false });

    if (error) throw new Error(`Supabase admin content read failed: ${error.message}`);
    return ((data ?? []) as AdminContentRow[]).map(toEntry);
  }

  async function saveEntry(input: AdminContentInput): Promise<AdminContentEntry> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("admin_content_entries")
      .upsert({
        kind: input.kind,
        slug: input.payload.slug,
        title: input.payload.title,
        status: input.status,
        payload: input.payload,
        updated_at: now,
        published_at: input.status === "published" ? now : null,
      }, { onConflict: "kind,slug" })
      .select("id, kind, slug, title, status, payload, created_at, updated_at, published_at")
      .single();

    if (error) throw new Error(`Supabase admin content save failed: ${error.message}`);
    return toEntry(data as AdminContentRow);
  }

  return {
    driver: "supabase",
    listEntries,
    saveEntry,
  };
}
