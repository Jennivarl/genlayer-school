import { NextRequest, NextResponse } from "next/server";
import { recordQuizAttempt } from "@/lib/backend/progress-store";
import { isAuthError, resolveLearnerAuth } from "@/lib/backend/auth";

type LessonQuizPayload = {
  learnerId?: string;
  regionSlug: string;
  lessonSlug: string;
  score: number;
  total: number;
  passed: boolean;
  answers: Record<string, number>;
};

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as LessonQuizPayload;
  const auth = await resolveLearnerAuth(request, payload.learnerId);
  if (isAuthError(auth)) return auth;

  if (!payload.regionSlug || !payload.lessonSlug) {
    return NextResponse.json({ error: "regionSlug and lessonSlug are required." }, { status: 400 });
  }

  const total = Math.max(1, payload.total);
  const score = Math.min(payload.score, total);
  const percent = Math.round((score / total) * 100);

  const progress = await recordQuizAttempt({
    learnerId: auth.learnerId,
    attempt: {
      quizKind: "lesson",
      quizSlug: `${payload.regionSlug}/${payload.lessonSlug}`,
      score,
      total,
      percent,
      passed: payload.passed,
      answers: payload.answers,
    },
  });

  return NextResponse.json({ auth, progress });
}
