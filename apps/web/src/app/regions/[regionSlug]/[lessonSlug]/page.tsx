"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { BookOpen, CheckCircle, ArrowRight, ArrowLeft, Clock, Target, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/app-providers";
import { ContentRenderer } from "@/components/content-renderer";
import type { ContentBlock } from "@genlayer-school/content";

type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctOption: number;
  explanation: string;
};

type Lesson = {
  slug: string;
  title: string;
  durationMinutes: number;
  summary: string;
  objectives: string[];
  content: ContentBlock[];
  questions?: QuizQuestion[];
};

type RegionalTrack = {
  slug: string;
  regionName: string;
  lessons: Lesson[];
  quiz: { slug: string };
};

export default function LessonPage() {
  const params = useParams<{ regionSlug: string; lessonSlug: string }>();
  const regionSlug = params.regionSlug ?? "";
  const lessonSlug = params.lessonSlug ?? "";
  const auth = useAuth();

  const [track, setTrack] = useState<RegionalTrack | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizPassed, setQuizPassed] = useState(false);

  useEffect(() => {
    if (!regionSlug || !lessonSlug) return;
    const qParams = new URLSearchParams({ learnerId: auth.learnerId });
    Promise.all([
      fetch("/api/catalog").then((r) => r.json()),
      auth.authFetch(`/api/progress?${qParams}`).then((r) => r.json()),
    ])
      .then(([catalog, progressData]) => {
        const tracks: RegionalTrack[] = catalog.regionalTracks ?? [];
        const foundTrack = tracks.find((t) => t.slug === regionSlug) ?? null;
        const foundLesson = foundTrack?.lessons.find((l) => l.slug === lessonSlug) ?? null;
        setTrack(foundTrack);
        setLesson(foundLesson);
        const done: string[] = progressData.progress?.completedLessons ?? [];
        setCompletedLessons(done);
        setCompleted(done.includes(`${regionSlug}/${lessonSlug}`));
        const attempts: Array<{ quizKind: string; quizSlug: string; passed: boolean }> =
          progressData.progress?.quizAttempts ?? [];
        const serverPassed = attempts.some(
          (a) => a.quizKind === "lesson" && a.quizSlug === `${regionSlug}/${lessonSlug}` && a.passed,
        );
        if (serverPassed) setQuizPassed(true);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.learnerId, regionSlug, lessonSlug]);

  async function handleMarkComplete() {
    if (completed || marking) return;
    setMarking(true);
    try {
      await auth.authFetch("/api/progress/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learnerId: auth.learnerId,
          courseSlug: regionSlug,
          lessonSlug,
          completed: true,
        }),
      });
      setCompleted(true);
      setCompletedLessons((prev) => [...prev, `${regionSlug}/${lessonSlug}`]);
    } finally {
      setMarking(false);
    }
  }

  useEffect(() => {
    if (!regionSlug || !lessonSlug) return;
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (localStorage.getItem(`genlayer_quiz_passed_${regionSlug}_${lessonSlug}`) === "1") setQuizPassed(true);
    } catch {}
  }, [regionSlug, lessonSlug]);

  const lessonIndex = track?.lessons.findIndex((l) => l.slug === lessonSlug) ?? -1;
  const prevLesson = lessonIndex > 0 ? track?.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex >= 0 && lessonIndex < (track?.lessons.length ?? 0) - 1
    ? track?.lessons[lessonIndex + 1]
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="h-6 w-32 bg-purple-100 rounded animate-pulse mb-6" />
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
            <div className="h-8 w-64 bg-purple-100 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {[1,2,3,4].map((i) => <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson || !track) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Lesson not found.</p>
          <Link href={`/regions/${regionSlug}`} className="text-purple-600 hover:underline">← Back to Course</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href={`/regions/${regionSlug}`} className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Lesson {lessonIndex + 1} of {track.lessons.length}
                  </div>
                  <h1 className="text-2xl font-bold">{lesson.title}</h1>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">{lesson.summary}</p>

              <div className="prose max-w-none">
                <ContentRenderer blocks={lesson.content} />
              </div>

              <div className="mt-8 pt-6 border-t border-purple-100">
                {(() => {
                  const hasQuiz = (lesson.questions?.length ?? 0) > 0;
                  const quizRequired = hasQuiz && !quizPassed && !completed;
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={handleMarkComplete}
                            disabled={completed || marking || quizRequired}
                            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                              completed
                                ? "bg-green-100 text-green-700 cursor-default"
                                : marking
                                ? "bg-purple-100 text-purple-400 cursor-wait"
                                : quizRequired
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600"
                            }`}
                          >
                            {completed
                              ? <><CheckCircle className="w-5 h-5" /> Completed</>
                              : marking
                              ? "Saving…"
                              : quizRequired
                              ? <><Lock className="w-4 h-4" /> Pass Quiz to Unlock</>
                              : <>Mark Complete <CheckCircle className="w-5 h-5" /></>}
                          </button>
                          {quizRequired && (
                            <p className="text-xs text-muted-foreground">Score 50%+ on the quiz to unlock</p>
                          )}
                        </div>

                        {hasQuiz && !completed && (
                          <Link
                            href={`/regions/${regionSlug}/${lessonSlug}/quiz`}
                            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                              quizRequired
                                ? "bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600"
                                : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                            }`}
                          >
                            {quizPassed ? "Review Quiz" : "Take Lesson Quiz"}
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                        )}

                        {completed && nextLesson && (
                          <Link
                            href={`/regions/${regionSlug}/${nextLesson.slug}`}
                            className="px-6 py-3 rounded-lg bg-purple-100 text-purple-600 font-semibold hover:bg-purple-200 transition-all flex items-center gap-2"
                          >
                            Next Lesson
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>

            {prevLesson && (
              <Link
                href={`/regions/${regionSlug}/${prevLesson.slug}`}
                className="inline-flex items-center text-sm text-purple-600 hover:underline gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous: {prevLesson.title}
              </Link>
            )}
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100"
            >
              <h3 className="font-semibold mb-4">Progress</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Lesson</span>
                  <span className="font-semibold">{lessonIndex + 1} of {track.lessons.length}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-500 rounded-full"
                    style={{ width: `${((lessonIndex + 1) / track.lessons.length) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>

            {lesson.objectives.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold">Learning Objectives</h3>
                </div>
                <div className="space-y-2 text-sm">
                  {lesson.objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{obj}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100"
            >
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">Duration</h3>
              </div>
              <p className="text-2xl font-bold text-purple-600">{lesson.durationMinutes} min</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100"
            >
              <h3 className="font-semibold mb-3">Course Lessons</h3>
              <div className="space-y-2 text-sm">
                {track.lessons.map((l, i) => {
                  const isDone = completedLessons.includes(`${regionSlug}/${l.slug}`);
                  const isCurrent = l.slug === lessonSlug;
                  return (
                    <Link
                      key={l.slug}
                      href={`/regions/${regionSlug}/${l.slug}`}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${
                        isCurrent
                          ? "text-purple-600 font-medium bg-purple-50"
                          : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
                      }`}
                    >
                      {isDone
                        ? <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        : <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${isCurrent ? "border-purple-600" : "border-gray-300"}`} />}
                      <span>{i + 1}. {l.title}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
