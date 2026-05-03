import type { CertificateEligibility, LearnerProgress, Quiz, QuizAttempt } from "@genlayer-school/content";
import { courses, weeklySummaries } from "@genlayer-school/content";

export function findCourseQuiz(quizSlug: string): { quiz: Quiz; courseSlug: string } | null {
  for (const course of courses) {
    if (course.quiz.slug === quizSlug) return { quiz: course.quiz, courseSlug: course.slug };
  }
  return null;
}

export function findWeeklyQuiz(quizSlug: string): { quiz: Quiz; weeklySlug: string } | null {
  for (const issue of weeklySummaries) {
    if (issue.quiz.slug === quizSlug) return { quiz: issue.quiz, weeklySlug: issue.slug };
  }
  return null;
}

export function gradeQuiz(quiz: Quiz, answers: Record<string, number>): Omit<QuizAttempt, "id" | "submittedAt"> {
  const score = quiz.questions.reduce((total, question) => {
    return total + (answers[question.id] === question.correctOption ? 1 : 0);
  }, 0);
  const total = quiz.questions.length;
  const percent = total === 0 ? 0 : Math.round((score / total) * 100);

  return {
    quizKind: "course",
    quizSlug: quiz.slug,
    score,
    total,
    percent,
    passed: percent >= quiz.passPercent,
    answers,
  };
}

export function summarizeProgress(progress: LearnerProgress) {
  const lessonTotal = courses.reduce((total, course) => total + course.lessons.length, 0);
  const completedLessonCount = progress.completedLessons.length;
  const passedQuizSlugs = new Set(progress.quizAttempts.filter((attempt) => attempt.passed).map((attempt) => attempt.quizSlug));

  return {
    learnerId: progress.learnerId,
    completedLessonCount,
    lessonTotal,
    lessonPercent: lessonTotal === 0 ? 0 : Math.round((completedLessonCount / lessonTotal) * 100),
    passedQuizCount: passedQuizSlugs.size,
    quizAttemptCount: progress.quizAttempts.length,
    updatedAt: progress.updatedAt,
  };
}

export function getCertificateEligibility(progress: LearnerProgress): CertificateEligibility[] {
  return courses.map((course) => {
    const lessonRequirements = course.lessons.map((lesson) => ({
      label: `Complete ${lesson.title}`,
      complete: progress.completedLessons.includes(`${course.slug}/${lesson.slug}`),
    }));
    const quizPassed = progress.quizAttempts.some((attempt) => attempt.quizSlug === course.quiz.slug && attempt.passed);
    const requirements = [
      ...lessonRequirements,
      { label: `Pass ${course.quiz.title}`, complete: quizPassed },
    ];

    return {
      certificateSlug: `${course.slug}-certificate`,
      title: `${course.title} Certificate`,
      eligible: requirements.every((requirement) => requirement.complete),
      requirements,
    };
  });
}
