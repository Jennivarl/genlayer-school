import type { CertificateRecord, CertificateStatus, LearnerProfile, LearnerProgress, QuizAttempt, QuizKind } from "@genlayer-school/content";

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

export type CertificateEligibilitySyncInput = {
  learnerId?: string | null;
  certificateSlugs: string[];
};

export type CertificateMintRequestInput = {
  learnerId?: string | null;
  certificateSlug: string;
};

export type ProfileUpdateInput = {
  learnerId?: string | null;
  username?: string | null;
  displayName?: string | null;
  walletAddress?: string | null;
  email?: string | null;
  pfpUrl?: string | null;
};

export type LearningAnalytics = {
  learnerCount: number;
  profileCount: number;
  completedLessonCount: number;
  quizAttemptCount: number;
  passedQuizAttemptCount: number;
  averageQuizPercent: number;
  certificateStatusCounts: Record<CertificateStatus, number>;
  recentQuizAttempts: Array<{
    learnerId: string;
    quizSlug: string;
    quizKind: QuizKind;
    percent: number;
    passed: boolean;
    submittedAt: string;
  }>;
};

export type CommunityMember = {
  displayName: string | null;
  regions: string[];
  lessonCount: number;
  quizzesPassed: number;
};

export type ProgressStore = {
  driver: "local" | "supabase";
  getProfile(learnerId?: string | null): Promise<LearnerProfile>;
  updateProfile(input: ProfileUpdateInput): Promise<LearnerProfile>;
  getProgress(learnerId?: string | null): Promise<LearnerProgress>;
  setLessonCompletion(input: LessonCompletionInput): Promise<LearnerProgress>;
  recordQuizAttempt(input: QuizAttemptInput): Promise<LearnerProgress>;
  getCertificateRecords(learnerId?: string | null): Promise<CertificateRecord[]>;
  syncEligibleCertificates(input: CertificateEligibilitySyncInput): Promise<CertificateRecord[]>;
  requestCertificateMint(input: CertificateMintRequestInput): Promise<CertificateRecord>;
  getLearningAnalytics(): Promise<LearningAnalytics>;
  getCommunityMembers(): Promise<CommunityMember[]>;
};
