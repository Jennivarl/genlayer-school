import { NextRequest, NextResponse } from "next/server";
import { findCourseQuiz, findWeeklyQuiz, getCertificateEligibility, gradeQuiz, summarizeProgress } from "@/lib/backend/learning";
import { recordQuizAttempt } from "@/lib/backend/progress-store";

type QuizPayload = {
  learnerId?: string;
  quizSlug?: string;
  quizKind?: "course" | "weekly";
  answers?: Record<string, number>;
};

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as QuizPayload;
  if (!payload.quizSlug || !payload.answers) {
    return NextResponse.json({ error: "quizSlug and answers are required." }, { status: 400 });
  }

  const courseMatch = findCourseQuiz(payload.quizSlug);
  const weeklyMatch = findWeeklyQuiz(payload.quizSlug);
  const match = payload.quizKind === "weekly" ? weeklyMatch : courseMatch ?? weeklyMatch;

  if (!match) {
    return NextResponse.json({ error: "Unknown quiz." }, { status: 400 });
  }

  const graded = gradeQuiz(match.quiz, payload.answers);
  const progress = await recordQuizAttempt({
    learnerId: payload.learnerId,
    attempt: {
      ...graded,
      quizKind: weeklyMatch?.quiz.slug === match.quiz.slug ? "weekly" : "course",
    },
  });

  return NextResponse.json({
    attempt: progress.quizAttempts[0],
    progress,
    summary: summarizeProgress(progress),
    certificates: getCertificateEligibility(progress),
  });
}
