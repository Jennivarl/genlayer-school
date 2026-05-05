import type { AdminContentEntry, AdminContentKind, AdminContentPayload, AdminContentStatus } from "@genlayer-school/content";

export type AdminContentInput = {
  kind: AdminContentKind;
  status: AdminContentStatus;
  payload: AdminContentPayload;
};

export type ContentStore = {
  driver: "local" | "supabase";
  listEntries(): Promise<AdminContentEntry[]>;
  saveEntry(input: AdminContentInput): Promise<AdminContentEntry>;
};
