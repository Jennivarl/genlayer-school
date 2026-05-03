export type Lesson = {
  slug: string;
  title: string;
  durationMinutes: number;
  summary: string;
};

export type Course = {
  slug: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  outcomes: string[];
  lessons: Lesson[];
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
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctOption: number;
  explanation: string;
};

export type WeeklySummary = {
  slug: string;
  weekOf: string;
  title: string;
  summary: string;
  keyConcepts: string[];
  links: SpotlightItem[];
  quiz: QuizQuestion[];
};
