import type { CertificateEligibility, LearnerProgress, Quiz, QuizAttempt, RegionalTrack } from "@genlayer-school/content";
import { courses, regionalTracks, weeklySummaries } from "@genlayer-school/content";

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

export function findRegionalQuiz(quizSlug: string, tracks: RegionalTrack[] = regionalTracks): { quiz: Quiz; regionSlug: string } | null {
  for (const track of tracks) {
    if (track.quiz.slug === quizSlug) return { quiz: track.quiz, regionSlug: track.slug };
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

export function validateQuizAnswers(quiz: Quiz, answers: unknown): answers is Record<string, number> {
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) return false;
  const submitted = answers as Record<string, unknown>;

  return quiz.questions.every((question) => {
    const answer = submitted[question.id];
    return typeof answer === "number" && Number.isInteger(answer) && answer >= 0 && answer < question.options.length;
  });
}

export function summarizeProgress(progress: LearnerProgress, tracks: RegionalTrack[] = regionalTracks) {
  const courseLessonTotal = courses.reduce((total, course) => total + course.lessons.length, 0);
  const regionalLessonTotal = tracks.reduce((total, track) => total + track.lessons.length, 0);
  const lessonTotal = courseLessonTotal + regionalLessonTotal;
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

export function getCertificateEligibility(progress: LearnerProgress, tracks: RegionalTrack[] = regionalTracks): CertificateEligibility[] {
  const courseCertificates = courses.map((course) => {
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

  const regionalCertificates = tracks.map((track) => {
    const lessonRequirements = track.lessons.map((lesson) => ({
      label: `Complete ${lesson.title}`,
      complete: progress.completedLessons.includes(`${track.slug}/${lesson.slug}`),
    }));
    const quizPassed = progress.quizAttempts.some((attempt) => attempt.quizSlug === track.quiz.slug && attempt.passed);
    const requirements = [
      ...lessonRequirements,
      { label: `Pass ${track.quiz.title}`, complete: quizPassed },
    ];

    return {
      certificateSlug: `${track.slug}-regional-certificate`,
      title: track.certificateTitle,
      eligible: requirements.every((requirement) => requirement.complete),
      requirements,
    };
  });

  return [...courseCertificates, ...regionalCertificates];
}
