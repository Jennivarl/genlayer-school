export type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; title: string; text: string }
  | { type: "code"; language: string; code: string };

export type Lesson = {
  slug: string;
  title: string;
  durationMinutes: number;
  summary: string;
  objectives: string[];
  content: ContentBlock[];
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctOption: number;
  explanation: string;
};

export type Quiz = {
  slug: string;
  title: string;
  passPercent: number;
  questions: QuizQuestion[];
};

export type Course = {
  slug: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  outcomes: string[];
  lessons: Lesson[];
  quiz: Quiz;
};

export type SpotlightItem = {
  title: string;
  description: string;
  url?: string;
};

export type CommunitySpotlight = {
  slug: string;
  month: string;
  title: string;
  featuredBuilder: string;
  featuredProject: string;
  highlights: SpotlightItem[];
  content: ContentBlock[];
};

export type WeeklySummary = {
  slug: string;
  weekOf: string;
  title: string;
  summary: string;
  keyConcepts: string[];
  links: SpotlightItem[];
  content: ContentBlock[];
  quiz: Quiz;
};

export type QuizAttempt = {
  id: string;
  quizKind: "course" | "weekly";
  quizSlug: string;
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  answers: Record<string, number>;
  submittedAt: string;
};

export type LearnerProfile = {
  learnerId: string;
  username: string | null;
  displayName: string | null;
  walletAddress: string | null;
  email: string | null;
  updatedAt: string;
};

export type LearnerProgress = {
  learnerId: string;
  completedLessons: string[];
  quizAttempts: QuizAttempt[];
  issuedCertificates: string[];
  updatedAt: string;
};

export type CertificateRequirement = {
  label: string;
  complete: boolean;
};

export type CertificateEligibility = {
  certificateSlug: string;
  title: string;
  eligible: boolean;
  requirements: CertificateRequirement[];
};

export type CertificateStatus = "eligible" | "mint_pending" | "minted" | "revoked";

export type CertificateRecord = {
  id: string;
  learnerId: string;
  certificateSlug: string;
  status: CertificateStatus;
  contractAddress: string | null;
  txHash: string | null;
  issuedAt: string;
  updatedAt: string;
};
