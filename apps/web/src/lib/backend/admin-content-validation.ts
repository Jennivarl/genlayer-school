import type {
  CommunitySpotlight,
  ContentBlock,
  Quiz,
  RegionalTrack,
  WeeklySummary,
} from "@genlayer-school/content";
import type { AdminContentInput } from "./content-store-types";

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validateContentBlocks(blocks: unknown, label: string): string | null {
  if (!Array.isArray(blocks) || blocks.length === 0) return `${label} content is required.`;

  for (const block of blocks as ContentBlock[]) {
    if (!isObject(block) || !hasText(block.type)) return `${label} content blocks must have a type.`;
    if (block.type === "paragraph" || block.type === "heading") {
      if (!hasText(block.text)) return `${label} ${block.type} blocks need text.`;
    } else if (block.type === "list") {
      if (!Array.isArray(block.items) || block.items.some((item) => !hasText(item))) return `${label} list blocks need non-empty items.`;
    } else if (block.type === "callout") {
      if (!hasText(block.title) || !hasText(block.text)) return `${label} callout blocks need title and text.`;
    } else if (block.type === "code") {
      if (!hasText(block.language) || !hasText(block.code)) return `${label} code blocks need language and code.`;
    } else {
      return `${label} contains an unsupported content block type.`;
    }
  }

  return null;
}

function validateQuiz(quiz: unknown, label: string, minQuestions: number): string | null {
  if (!isObject(quiz)) return `${label} quiz is required.`;
  const candidate = quiz as Quiz;
  if (!hasText(candidate.slug) || !hasText(candidate.title)) return `${label} quiz slug and title are required.`;
  if (!Number.isFinite(candidate.passPercent) || candidate.passPercent < 0 || candidate.passPercent > 100) {
    return `${label} quiz pass percent must be between 0 and 100.`;
  }
  if (!Array.isArray(candidate.questions) || candidate.questions.length < minQuestions) {
    return `${label} quiz needs at least ${minQuestions} question${minQuestions === 1 ? "" : "s"}.`;
  }

  for (const question of candidate.questions) {
    if (!hasText(question.id) || !hasText(question.prompt) || !hasText(question.explanation)) {
      return `${label} quiz questions need id, prompt, and explanation.`;
    }
    if (!Array.isArray(question.options) || question.options.length < 2 || question.options.some((option) => !hasText(option))) {
      return `${label} quiz questions need at least two non-empty options.`;
    }
    if (!Number.isInteger(question.correctOption) || question.correctOption < 0 || question.correctOption >= question.options.length) {
      return `${label} quiz questions need valid correct option indexes.`;
    }
  }

  return null;
}

function validateWeekly(payload: WeeklySummary): string | null {
  if (!hasText(payload.slug) || !hasText(payload.title) || !hasText(payload.summary)) return "Weekly slug, title, and summary are required.";
  if (!hasText(payload.weekOf)) return "Weekly weekOf is required.";
  if (!Array.isArray(payload.keyConcepts) || payload.keyConcepts.some((item) => !hasText(item))) return "Weekly key concepts must be non-empty strings.";
  if (!Array.isArray(payload.links)) return "Weekly links must be an array.";
  const contentError = validateContentBlocks(payload.content, "Weekly");
  if (contentError) return contentError;
  return validateQuiz(payload.quiz, "Weekly", 1);
}

function validateSpotlight(payload: CommunitySpotlight): string | null {
  if (!hasText(payload.slug) || !hasText(payload.title) || !hasText(payload.month)) return "Spotlight slug, title, and month are required.";
  if (!hasText(payload.featuredBuilder) || !hasText(payload.featuredProject)) return "Spotlight featured builder and project are required.";
  if (!Array.isArray(payload.highlights)) return "Spotlight highlights must be an array.";
  const contentError = validateContentBlocks(payload.content, "Spotlight");
  if (contentError) return contentError;
  return null;
}

function validateRegional(payload: RegionalTrack): string | null {
  if (!hasText(payload.slug) || !hasText(payload.title) || !hasText(payload.regionName) || !hasText(payload.nativeRegionName)) {
    return "Regional slug, title, and region names are required.";
  }
  if (!hasText(payload.languageName) || !hasText(payload.nativeLanguageName) || !hasText(payload.locale)) {
    return "Regional language labels and locale are required.";
  }
  if (!hasText(payload.description) || !hasText(payload.unityMessage) || !hasText(payload.certificateTitle)) {
    return "Regional description, unity message, and certificate title are required.";
  }
  if (!Array.isArray(payload.lessons) || payload.lessons.length === 0) return "Regional lessons are required.";

  for (const lesson of payload.lessons) {
    if (!hasText(lesson.slug) || !hasText(lesson.title) || !hasText(lesson.summary)) {
      return "Every regional lesson needs a slug, title, and summary.";
    }
    if (!Number.isFinite(lesson.durationMinutes) || lesson.durationMinutes <= 0) return "Regional lesson duration must be a positive number.";
    if (!Array.isArray(lesson.objectives) || lesson.objectives.some((objective) => !hasText(objective))) {
      return "Every regional lesson needs non-empty objectives.";
    }
    const contentError = validateContentBlocks(lesson.content, "Regional lesson");
    if (contentError) return contentError;
  }

  return validateQuiz(payload.quiz, "Regional", 5);
}

export function validateAdminContentInput(input: AdminContentInput): string | null {
  if (!input.payload || !isObject(input.payload)) return "payload is required.";
  if (!hasText(input.payload.slug)) return "payload.slug is required.";
  if (!hasText(input.payload.title)) return "payload.title is required.";

  if (input.kind === "weekly") return validateWeekly(input.payload as WeeklySummary);
  if (input.kind === "spotlight") return validateSpotlight(input.payload as CommunitySpotlight);
  return validateRegional(input.payload as RegionalTrack);
}
