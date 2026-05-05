import * as localStore from "./local-content-store";
import { createSupabaseContentStore } from "./supabase-content-store";
import type { ContentStore } from "./content-store-types";

function getRequestedDriver(): "auto" | "local" | "supabase" {
  const raw = process.env.GENLAYER_SCHOOL_STORAGE_DRIVER?.toLowerCase();
  if (raw === "local" || raw === "supabase") return raw;
  return "auto";
}

function createStore(): ContentStore {
  const requestedDriver = getRequestedDriver();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const canUseSupabase = Boolean(supabaseUrl && serviceRoleKey);

  if ((requestedDriver === "supabase" || requestedDriver === "auto") && canUseSupabase) {
    return createSupabaseContentStore({
      url: supabaseUrl as string,
      serviceRoleKey: serviceRoleKey as string,
    });
  }

  if (requestedDriver === "supabase" && !canUseSupabase) {
    throw new Error("GENLAYER_SCHOOL_STORAGE_DRIVER=supabase requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  return {
    driver: "local",
    listEntries: localStore.listEntries,
    saveEntry: localStore.saveEntry,
  };
}

const store = createStore();

export const contentStorageDriver = store.driver;
export const listAdminContentEntries = store.listEntries;
export const saveAdminContentEntry = store.saveEntry;
