import type { LearnerProfile, LearnerProgress, QuizAttempt } from "@genlayer-school/content";

export type LessonCompletionInput = {
  learnerId?: string | null;
  courseSlug: string;
  lessonSlug: string;
  completed: boolean;
};

export type QuizAttemptInput = {
  learnerId?: string | null;
  attempt: Omit<QuizAttempt, "id" | "submittedAt">;
};

export type ProfileUpdateInput = {
  learnerId?: string | null;
  username?: string | null;
  displayName?: string | null;
  walletAddress?: string | null;
  email?: string | null;
};

export type ProgressStore = {
  driver: "local" | "supabase";
  getProfile(learnerId?: string | null): Promise<LearnerProfile>;
  updateProfile(input: ProfileUpdateInput): Promise<LearnerProfile>;
  getProgress(learnerId?: string | null): Promise<LearnerProgress>;
  setLessonCompletion(input: LessonCompletionInput): Promise<LearnerProgress>;
  recordQuizAttempt(input: QuizAttemptInput): Promise<LearnerProgress>;
};
