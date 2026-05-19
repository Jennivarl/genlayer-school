import { NextRequest, NextResponse } from "next/server";
import { findCourseQuiz, findRegionalQuiz, findWeeklyQuiz, getCertificateEligibility, gradeQuiz, summarizeProgress, validateQuizAnswers } from "@/lib/backend/learning";
import { recordQuizAttempt } from "@/lib/backend/progress-store";
import { isAuthError, resolveLearnerAuth } from "@/lib/backend/auth";
import { getPublishedRegionalTracks } from "@/lib/backend/public-content";

type QuizPayload = {
  learnerId?: string;
  quizSlug?: string;
  quizKind?: "course" | "weekly" | "regional";
  answers?: Record<string, number>;
};

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as QuizPayload;
  const auth = await resolveLearnerAuth(request, payload.learnerId);
  if (isAuthError(auth)) return auth;

  if (!payload.quizSlug || !payload.answers) {
    return NextResponse.json({ error: "quizSlug and answers are required." }, { status: 400 });
  }

  const courseMatch = findCourseQuiz(payload.quizSlug);
  const weeklyMatch = findWeeklyQuiz(payload.quizSlug);
  const regionalTracks = await getPublishedRegionalTracks();
  const regionalMatch = findRegionalQuiz(payload.quizSlug, regionalTracks);
  const match = payload.quizKind === "weekly"
    ? weeklyMatch
    : payload.quizKind === "regional"
      ? regionalMatch
      : courseMatch ?? weeklyMatch ?? regionalMatch;

  if (!match) {
    return NextResponse.json({ error: "Unknown quiz." }, { status: 400 });
  }
  if (!validateQuizAnswers(match.quiz, payload.answers)) {
    return NextResponse.json({ error: "Answers must include one valid option index for every quiz question." }, { status: 400 });
  }

  const graded = gradeQuiz(match.quiz, payload.answers);
  const progress = await recordQuizAttempt({
    learnerId: auth.learnerId,
    attempt: {
      ...graded,
      quizKind: regionalMatch?.quiz.slug === match.quiz.slug
        ? "regional"
        : weeklyMatch?.quiz.slug === match.quiz.slug
          ? "weekly"
          : "course",
    },
  });

  return NextResponse.json({
    auth,
    attempt: progress.quizAttempts[0],
    progress,
    summary: summarizeProgress(progress, regionalTracks),
    certificates: getCertificateEligibility(progress, regionalTracks),
  });
}
