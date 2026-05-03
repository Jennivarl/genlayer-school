import { NextRequest, NextResponse } from "next/server";
import { courses } from "@genlayer-school/content";
import { getCertificateEligibility, summarizeProgress } from "@/lib/backend/learning";
import { setLessonCompletion } from "@/lib/backend/progress-store";
import { isAuthError, resolveLearnerAuth } from "@/lib/backend/auth";

type LessonPayload = {
  learnerId?: string;
  courseSlug?: string;
  lessonSlug?: string;
  completed?: boolean;
};

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as LessonPayload;
  const auth = await resolveLearnerAuth(request, payload.learnerId);
  if (isAuthError(auth)) return auth;

  const course = courses.find((item) => item.slug === payload.courseSlug);
  const lesson = course?.lessons.find((item) => item.slug === payload.lessonSlug);

  if (!course || !lesson) {
    return NextResponse.json({ error: "Unknown course or lesson." }, { status: 400 });
  }

  const progress = await setLessonCompletion({
    learnerId: auth.learnerId,
    courseSlug: course.slug,
    lessonSlug: lesson.slug,
    completed: payload.completed ?? true,
  });

  return NextResponse.json({
    auth,
    progress,
    summary: summarizeProgress(progress),
    certificates: getCertificateEligibility(progress),
  });
}
