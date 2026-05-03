import * as localStore from "./local-progress-store";
import { createSupabaseProgressStore } from "./supabase-progress-store";
import type { ProgressStore } from "./progress-store-types";

function getRequestedDriver(): "auto" | "local" | "supabase" {
  const raw = process.env.GENLAYER_SCHOOL_STORAGE_DRIVER?.toLowerCase();
  if (raw === "local" || raw === "supabase") return raw;
  return "auto";
}

function createStore(): ProgressStore {
  const requestedDriver = getRequestedDriver();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const canUseSupabase = Boolean(supabaseUrl && serviceRoleKey);

  if ((requestedDriver === "supabase" || requestedDriver === "auto") && canUseSupabase) {
    return createSupabaseProgressStore({
      url: supabaseUrl as string,
      serviceRoleKey: serviceRoleKey as string,
    });
  }

  if (requestedDriver === "supabase" && !canUseSupabase) {
    throw new Error("GENLAYER_SCHOOL_STORAGE_DRIVER=supabase requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  return {
    driver: "local",
    getProgress: localStore.getProgress,
    setLessonCompletion: localStore.setLessonCompletion,
    recordQuizAttempt: localStore.recordQuizAttempt,
  };
}

const store = createStore();

export const storageDriver = store.driver;
export const getProgress = store.getProgress;
export const setLessonCompletion = store.setLessonCompletion;
export const recordQuizAttempt = store.recordQuizAttempt;
export { normalizeLearnerId } from "./local-progress-store";
