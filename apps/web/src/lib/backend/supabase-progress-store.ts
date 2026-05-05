import { createClient } from "@supabase/supabase-js";
import type { CertificateRecord, CertificateStatus, LearnerProfile, LearnerProgress, QuizAttempt } from "@genlayer-school/content";
import type { CertificateEligibilitySyncInput, CertificateMintRequestInput, LessonCompletionInput, ProfileUpdateInput, ProgressStore, QuizAttemptInput } from "./progress-store-types";
import { normalizeLearnerId, validateUsername } from "./local-progress-store";

type SupabaseConfig = {
  url: string;
  serviceRoleKey: string;
};

type ProfileRow = {
  learner_id: string;
  username: string | null;
  display_name: string | null;
  wallet_address: string | null;
  email: string | null;
  updated_at: string;
};

type LessonProgressRow = {
  course_slug: string;
  lesson_slug: string;
};

type QuizAttemptRow = {
  id: string;
  quiz_kind: "course" | "weekly";
  quiz_slug: string;
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  answers: Record<string, number>;
  submitted_at: string;
};

type CertificateRow = {
  id: string;
  learner_id: string;
  certificate_slug: string;
  status: CertificateStatus;
  contract_address: string | null;
  tx_hash: string | null;
  issued_at: string;
  updated_at: string | null;
};

function nowIso(): string {
  return new Date().toISOString();
}

function createEmptyProgress(learnerId: string): LearnerProgress {
  return {
    learnerId,
    completedLessons: [],
    quizAttempts: [],
    issuedCertificates: [],
    updatedAt: nowIso(),
  };
}

function toProfile(row: ProfileRow): LearnerProfile {
  return {
    learnerId: row.learner_id,
    username: row.username,
    displayName: row.display_name,
    walletAddress: row.wallet_address,
    email: row.email,
    updatedAt: row.updated_at,
  };
}

function toAttempt(row: QuizAttemptRow): QuizAttempt {
  return {
    id: row.id,
    quizKind: row.quiz_kind,
    quizSlug: row.quiz_slug,
    score: row.score,
    total: row.total,
    percent: row.percent,
    passed: row.passed,
    answers: row.answers,
    submittedAt: row.submitted_at,
  };
}

function toCertificateRecord(row: CertificateRow): CertificateRecord {
  return {
    id: row.id,
    learnerId: row.learner_id,
    certificateSlug: row.certificate_slug,
    status: row.status,
    contractAddress: row.contract_address,
    txHash: row.tx_hash,
    issuedAt: row.issued_at,
    updatedAt: row.updated_at ?? row.issued_at,
  };
}

export function createSupabaseProgressStore(config: SupabaseConfig): ProgressStore {
  const supabase = createClient(config.url, config.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  async function ensureLearner(learnerId: string): Promise<void> {
    const { error } = await supabase
      .from("learner_profiles")
      .upsert({ learner_id: learnerId, updated_at: nowIso() }, { onConflict: "learner_id" });

    if (error) throw new Error(`Supabase learner upsert failed: ${error.message}`);
  }

  async function getProfile(learnerId?: string | null): Promise<LearnerProfile> {
    const id = normalizeLearnerId(learnerId);
    await ensureLearner(id);

    const { data, error } = await supabase
      .from("learner_profiles")
      .select("learner_id, username, display_name, wallet_address, email, updated_at")
      .eq("learner_id", id)
      .single();

    if (error) throw new Error(`Supabase profile read failed: ${error.message}`);
    return toProfile(data as ProfileRow);
  }

  async function updateProfile(input: ProfileUpdateInput): Promise<LearnerProfile> {
    const id = normalizeLearnerId(input.learnerId);
    await ensureLearner(id);
    const update: Record<string, string | null> = { updated_at: nowIso() };

    if (input.username !== undefined) update.username = validateUsername(input.username);
    if (input.displayName !== undefined) update.display_name = input.displayName?.trim() || null;
    if (input.walletAddress !== undefined) update.wallet_address = input.walletAddress?.trim() || null;
    if (input.email !== undefined) update.email = input.email?.trim() || null;

    const { error } = await supabase
      .from("learner_profiles")
      .update(update)
      .eq("learner_id", id);

    if (error) {
      if (error.code === "23505") throw new Error("Username is already taken.");
      throw new Error(`Supabase profile update failed: ${error.message}`);
    }

    return getProfile(id);
  }

  async function getProgress(learnerId?: string | null): Promise<LearnerProgress> {
    const id = normalizeLearnerId(learnerId);
    await ensureLearner(id);

    const [lessonsResult, attemptsResult, certificatesResult] = await Promise.all([
      supabase
        .from("lesson_progress")
        .select("course_slug, lesson_slug")
        .eq("learner_id", id),
      supabase
        .from("quiz_attempts")
        .select("id, quiz_kind, quiz_slug, score, total, percent, passed, answers, submitted_at")
        .eq("learner_id", id)
        .order("submitted_at", { ascending: false }),
      supabase
        .from("certificates")
        .select("certificate_slug")
        .eq("learner_id", id)
        .eq("status", "minted"),
    ]);

    if (lessonsResult.error) throw new Error(`Supabase lesson read failed: ${lessonsResult.error.message}`);
    if (attemptsResult.error) throw new Error(`Supabase quiz read failed: ${attemptsResult.error.message}`);
    if (certificatesResult.error) throw new Error(`Supabase certificate read failed: ${certificatesResult.error.message}`);

    const lessonRows = (lessonsResult.data ?? []) as LessonProgressRow[];
    const attemptRows = (attemptsResult.data ?? []) as QuizAttemptRow[];
    const certificateRows = (certificatesResult.data ?? []) as CertificateRow[];

    return {
      ...createEmptyProgress(id),
      completedLessons: lessonRows.map((row) => `${row.course_slug}/${row.lesson_slug}`).sort(),
      quizAttempts: attemptRows.map(toAttempt),
      issuedCertificates: certificateRows.map((row) => row.certificate_slug).sort(),
      updatedAt: attemptRows[0]?.submitted_at ?? nowIso(),
    };
  }

  async function setLessonCompletion(input: LessonCompletionInput): Promise<LearnerProgress> {
    const id = normalizeLearnerId(input.learnerId);
    await ensureLearner(id);

    if (input.completed) {
      const { error } = await supabase.from("lesson_progress").upsert(
        {
          learner_id: id,
          course_slug: input.courseSlug,
          lesson_slug: input.lessonSlug,
          completed_at: nowIso(),
        },
        { onConflict: "learner_id,course_slug,lesson_slug" },
      );
      if (error) throw new Error(`Supabase lesson upsert failed: ${error.message}`);
    } else {
      const { error } = await supabase
        .from("lesson_progress")
        .delete()
        .eq("learner_id", id)
        .eq("course_slug", input.courseSlug)
        .eq("lesson_slug", input.lessonSlug);
      if (error) throw new Error(`Supabase lesson delete failed: ${error.message}`);
    }

    return getProgress(id);
  }

  async function recordQuizAttempt(input: QuizAttemptInput): Promise<LearnerProgress> {
    const id = normalizeLearnerId(input.learnerId);
    await ensureLearner(id);
    const submittedAt = nowIso();
    const attempt = input.attempt;

    const { error } = await supabase.from("quiz_attempts").insert({
      learner_id: id,
      quiz_kind: attempt.quizKind,
      quiz_slug: attempt.quizSlug,
      score: attempt.score,
      total: attempt.total,
      percent: attempt.percent,
      passed: attempt.passed,
      answers: attempt.answers,
      submitted_at: submittedAt,
    });

    if (error) throw new Error(`Supabase quiz insert failed: ${error.message}`);
    return getProgress(id);
  }

  async function getCertificateRecords(learnerId?: string | null): Promise<CertificateRecord[]> {
    const id = normalizeLearnerId(learnerId);
    await ensureLearner(id);

    const { data, error } = await supabase
      .from("certificates")
      .select("id, learner_id, certificate_slug, status, contract_address, tx_hash, issued_at, updated_at")
      .eq("learner_id", id)
      .order("certificate_slug", { ascending: true });

    if (error) throw new Error(`Supabase certificate record read failed: ${error.message}`);
    return ((data ?? []) as CertificateRow[]).map(toCertificateRecord);
  }

  async function syncEligibleCertificates(input: CertificateEligibilitySyncInput): Promise<CertificateRecord[]> {
    const id = normalizeLearnerId(input.learnerId);
    await ensureLearner(id);
    const currentRecords = await getCertificateRecords(id);
    const recordsBySlug = new Map(currentRecords.map((record) => [record.certificateSlug, record]));
    const now = nowIso();
    const rowsToUpsert = input.certificateSlugs
      .filter((certificateSlug) => {
        const existing = recordsBySlug.get(certificateSlug);
        return !existing || existing.status === "revoked";
      })
      .map((certificateSlug) => ({
        learner_id: id,
        certificate_slug: certificateSlug,
        status: "eligible",
        updated_at: now,
      }));

    if (rowsToUpsert.length > 0) {
      const { error } = await supabase
        .from("certificates")
        .upsert(rowsToUpsert, { onConflict: "learner_id,certificate_slug" });

      if (error) throw new Error(`Supabase eligible certificate sync failed: ${error.message}`);
    }

    return getCertificateRecords(id);
  }

  async function requestCertificateMint(input: CertificateMintRequestInput): Promise<CertificateRecord> {
    const id = normalizeLearnerId(input.learnerId);
    await ensureLearner(id);

    const currentRecords = await getCertificateRecords(id);
    const existing = currentRecords.find((record) => record.certificateSlug === input.certificateSlug);
    if (!existing || existing.status === "revoked") {
      throw new Error("Certificate is not eligible for minting yet.");
    }
    if (existing.status === "minted") return existing;

    const { data, error } = await supabase
      .from("certificates")
      .update({ status: "mint_pending", updated_at: nowIso() })
      .eq("learner_id", id)
      .eq("certificate_slug", input.certificateSlug)
      .select("id, learner_id, certificate_slug, status, contract_address, tx_hash, issued_at, updated_at")
      .single();

    if (error) throw new Error(`Supabase certificate mint request failed: ${error.message}`);
    return toCertificateRecord(data as CertificateRow);
  }

  return {
    driver: "supabase",
    getProfile,
    updateProfile,
    getProgress,
    setLessonCompletion,
    recordQuizAttempt,
    getCertificateRecords,
    syncEligibleCertificates,
    requestCertificateMint,
  };
}
