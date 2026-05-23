import { createClient } from "@supabase/supabase-js";
import type { CertificateRecord, CertificateStatus, LearnerProfile, LearnerProgress, QuizAttempt, QuizKind } from "@genlayer-school/content";
import type { CommunityMember, CertificateEligibilitySyncInput, CertificateMintRequestInput, LearningAnalytics, LessonCompletionInput, ProfileUpdateInput, ProgressStore, QuizAttemptInput } from "./progress-store-types";
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
  pfp_url: string | null;
  updated_at: string;
};

type LessonProgressRow = {
  course_slug: string;
  lesson_slug: string;
};

type QuizAttemptRow = {
  id: string;
  quiz_kind: QuizKind;
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

type AnalyticsLessonRow = {
  learner_id: string;
};

type AnalyticsQuizRow = {
  learner_id: string;
  quiz_kind: QuizKind;
  quiz_slug: string;
  percent: number;
  passed: boolean;
  submitted_at: string;
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
    pfpUrl: row.pfp_url ?? null,
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
      .select("*")
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

    const hasPfp = input.pfpUrl !== undefined;
    if (hasPfp) update.pfp_url = input.pfpUrl ?? null;

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

  async function getLearningAnalytics(): Promise<LearningAnalytics> {
    const [profilesResult, lessonsResult, attemptsResult, certificatesResult] = await Promise.all([
      supabase
        .from("learner_profiles")
        .select("learner_id"),
      supabase
        .from("lesson_progress")
        .select("learner_id"),
      supabase
        .from("quiz_attempts")
        .select("learner_id, quiz_kind, quiz_slug, percent, passed, submitted_at")
        .order("submitted_at", { ascending: false }),
      supabase
        .from("certificates")
        .select("id, learner_id, certificate_slug, status, contract_address, tx_hash, issued_at, updated_at"),
    ]);

    if (profilesResult.error) throw new Error(`Supabase analytics profile read failed: ${profilesResult.error.message}`);
    if (lessonsResult.error) throw new Error(`Supabase analytics lesson read failed: ${lessonsResult.error.message}`);
    if (attemptsResult.error) throw new Error(`Supabase analytics quiz read failed: ${attemptsResult.error.message}`);
    if (certificatesResult.error) throw new Error(`Supabase analytics certificate read failed: ${certificatesResult.error.message}`);

    const profileRows = (profilesResult.data ?? []) as Array<{ learner_id: string }>;
    const lessonRows = (lessonsResult.data ?? []) as AnalyticsLessonRow[];
    const attemptRows = (attemptsResult.data ?? []) as AnalyticsQuizRow[];
    const certificateRows = (certificatesResult.data ?? []) as CertificateRow[];
    const learnerIds = new Set([
      ...profileRows.map((row) => row.learner_id),
      ...lessonRows.map((row) => row.learner_id),
      ...attemptRows.map((row) => row.learner_id),
      ...certificateRows.map((row) => row.learner_id),
    ]);
    const averageQuizPercent = attemptRows.length === 0
      ? 0
      : Math.round(attemptRows.reduce((total, row) => total + row.percent, 0) / attemptRows.length);

    return {
      learnerCount: learnerIds.size,
      profileCount: profileRows.length,
      completedLessonCount: lessonRows.length,
      quizAttemptCount: attemptRows.length,
      passedQuizAttemptCount: attemptRows.filter((row) => row.passed).length,
      averageQuizPercent,
      certificateStatusCounts: {
        eligible: certificateRows.filter((row) => row.status === "eligible").length,
        mint_pending: certificateRows.filter((row) => row.status === "mint_pending").length,
        minted: certificateRows.filter((row) => row.status === "minted").length,
        revoked: certificateRows.filter((row) => row.status === "revoked").length,
      },
      recentQuizAttempts: attemptRows.slice(0, 10).map((row) => ({
        learnerId: row.learner_id,
        quizSlug: row.quiz_slug,
        quizKind: row.quiz_kind,
        percent: row.percent,
        passed: row.passed,
        submittedAt: row.submitted_at,
      })),
    };
  }

  const REGIONAL_SLUGS = new Set([
    "china", "india", "indonesia", "latam", "latam-es", "latam-pt",
    "nigeria", "russia", "korea", "turkey", "ukraine", "vietnam",
  ]);

  async function getCommunityMembers(): Promise<CommunityMember[]> {
    const [lessonsResult, profilesResult, attemptsResult] = await Promise.all([
      supabase.from("lesson_progress").select("learner_id, course_slug"),
      supabase.from("learner_profiles").select("learner_id, display_name"),
      supabase.from("quiz_attempts").select("learner_id, passed"),
    ]);

    const lessons = (lessonsResult.data ?? []) as Array<{ learner_id: string; course_slug: string }>;
    const profiles = (profilesResult.data ?? []) as Array<{ learner_id: string; display_name: string | null }>;
    const attempts = (attemptsResult.data ?? []) as Array<{ learner_id: string; passed: boolean }>;

    const profileMap = new Map(profiles.map((p) => [p.learner_id, p.display_name]));

    const byLearner = new Map<string, { regions: Set<string>; lessonCount: number; quizzesPassed: number }>();
    for (const lesson of lessons) {
      const region = lesson.course_slug;
      if (!region || !REGIONAL_SLUGS.has(region)) continue;
      if (!byLearner.has(lesson.learner_id)) {
        byLearner.set(lesson.learner_id, { regions: new Set(), lessonCount: 0, quizzesPassed: 0 });
      }
      const entry = byLearner.get(lesson.learner_id)!;
      entry.regions.add(region);
      entry.lessonCount += 1;
    }
    for (const attempt of attempts) {
      if (!attempt.passed) continue;
      if (!byLearner.has(attempt.learner_id)) continue;
      byLearner.get(attempt.learner_id)!.quizzesPassed += 1;
    }

    return [...byLearner.entries()]
      .map(([learnerId, entry]) => ({
        displayName: profileMap.get(learnerId) ?? null,
        regions: [...entry.regions],
        lessonCount: entry.lessonCount,
        quizzesPassed: entry.quizzesPassed,
      }))
      .filter((m) => m.lessonCount > 0 && m.displayName)
      .sort((a, b) => b.regions.length - a.regions.length || b.lessonCount - a.lessonCount);
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
    getLearningAnalytics,
    getCommunityMembers,
  };
}
