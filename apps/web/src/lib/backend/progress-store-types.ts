import type { LearnerProgress, QuizAttempt } from "@genlayer-school/content";

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

export type ProgressStore = {
  driver: "local" | "supabase";
  getProgress(learnerId?: string | null): Promise<LearnerProgress>;
  setLessonCompletion(input: LessonCompletionInput): Promise<LearnerProgress>;
  recordQuizAttempt(input: QuizAttemptInput): Promise<LearnerProgress>;
};
