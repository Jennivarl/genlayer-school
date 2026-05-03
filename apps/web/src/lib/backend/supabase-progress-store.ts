import { createClient } from "@supabase/supabase-js";
import type { LearnerProfile, LearnerProgress, QuizAttempt } from "@genlayer-school/content";
import type { LessonCompletionInput, ProfileUpdateInput, ProgressStore, QuizAttemptInput } from "./progress-store-types";
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
  certificate_slug: string;
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
        .neq("status", "revoked"),
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

  return {
    driver: "supabase",
    getProfile,
    updateProfile,
    getProgress,
    setLessonCompletion,
    recordQuizAttempt,
  };
}
