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
    getProfile: localStore.getProfile,
    updateProfile: localStore.updateProfile,
    getProgress: localStore.getProgress,
    setLessonCompletion: localStore.setLessonCompletion,
    recordQuizAttempt: localStore.recordQuizAttempt,
    getCertificateRecords: localStore.getCertificateRecords,
    syncEligibleCertificates: localStore.syncEligibleCertificates,
    requestCertificateMint: localStore.requestCertificateMint,
    getLearningAnalytics: localStore.getLearningAnalytics,
  };
}

const store = createStore();

export const storageDriver = store.driver;
export const getProfile = store.getProfile;
export const updateProfile = store.updateProfile;
export const getProgress = store.getProgress;
export const setLessonCompletion = store.setLessonCompletion;
export const recordQuizAttempt = store.recordQuizAttempt;
export const getCertificateRecords = store.getCertificateRecords;
export const syncEligibleCertificates = store.syncEligibleCertificates;
export const requestCertificateMint = store.requestCertificateMint;
export const getLearningAnalytics = store.getLearningAnalytics;
export { normalizeLearnerId } from "./local-progress-store";
