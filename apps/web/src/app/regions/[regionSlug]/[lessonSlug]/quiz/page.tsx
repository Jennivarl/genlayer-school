"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/app-providers";

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
  questions?: QuizQuestion[];
};

type RegionalTrack = {
  slug: string;
  lessons: Lesson[];
};

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <svg className="w-8 h-8 animate-spin text-purple-600" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    </div>
  );
}

function shuffleQuestions(qs: QuizQuestion[]): QuizQuestion[] {
  return qs.map((q) => {
    const indices = Array.from({ length: q.options.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
    return {
      ...q,
      options: indices.map((i) => q.options[i]),
      correctOption: indices.indexOf(q.correctOption),
    };
  });
}

export default function LessonQuizPage() {
  const params = useParams<{ regionSlug: string; lessonSlug: string }>();
  const regionSlug = params.regionSlug ?? "";
  const lessonSlug = params.lessonSlug ?? "";
  const auth = useAuth();

  const [track, setTrack] = useState<RegionalTrack | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!regionSlug || !lessonSlug) return;
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((d) => {
        const tracks: RegionalTrack[] = d.regionalTracks ?? [];
        const foundTrack = tracks.find((t) => t.slug === regionSlug) ?? null;
        const foundLesson = foundTrack?.lessons.find((l) => l.slug === lessonSlug) ?? null;
        setTrack(foundTrack);
        setLesson(foundLesson);
        setShuffledQuestions(shuffleQuestions(foundLesson?.questions ?? []));
      })
      .finally(() => setLoading(false));
  }, [regionSlug, lessonSlug]);

  if (loading) return <Spinner />;

  if (!lesson || !track) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Quiz not found.</p>
          <Link href={`/regions/${regionSlug}`} className="text-purple-600 hover:underline">← Back to Course</Link>
        </div>
      </div>
    );
  }

  const questions = shuffledQuestions;
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No quiz for this lesson.</p>
          <Link href={`/regions/${regionSlug}/${lessonSlug}`} className="text-purple-600 hover:underline">← Back to Lesson</Link>
        </div>
      </div>
    );
  }

  const lessonIndex = track.lessons.findIndex((l) => l.slug === lessonSlug);
  const nextLesson = lessonIndex >= 0 && lessonIndex < track.lessons.length - 1
    ? track.lessons[lessonIndex + 1]
    : null;
  const isLastLesson = !nextLesson;

  const question = questions[currentQuestion];

  function handleSelect(index: number) {
    if (revealed) return;
    setSelectedAnswer(index);
  }

  function handleReveal() {
    if (selectedAnswer === null || revealed) return;
    setRevealed(true);
  }

  function handleNext() {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers, selectedAnswer];
    if (currentQuestion < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setRevealed(false);
    } else {
      const score = newAnswers.filter((a, i) => a === questions[i].correctOption).length;
      const passed = score >= Math.ceil(questions.length * 0.5);
      if (passed) {
        try {
          localStorage.setItem(`genlayer_quiz_passed_${regionSlug}_${lessonSlug}`, "1");
        } catch {}
        const answersRecord: Record<string, number> = {};
        questions.forEach((q, i) => { answersRecord[q.id] = newAnswers[i]; });
        auth.authFetch("/api/progress/lesson-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            regionSlug,
            lessonSlug,
            score,
            total: questions.length,
            passed,
            answers: answersRecord,
          }),
        }).catch(() => {});
        auth.authFetch("/api/progress/lesson", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            learnerId: auth.learnerId,
            courseSlug: regionSlug,
            lessonSlug,
            completed: true,
          }),
        }).catch(() => {});
      }
      setAnswers(newAnswers);
      setDone(true);
    }
  }

  if (done) {
    const score = answers.filter((a, i) => a === questions[i].correctOption).length;
    const passed = score >= Math.ceil(questions.length * 0.5);

    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white rounded-2xl p-8 shadow-lg border-2 ${passed ? "border-green-300" : "border-orange-300"}`}
          >
            <div className="text-center mb-8">
              {passed ? (
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-12 h-12 text-orange-600" />
                </div>
              )}
              <h1 className="text-3xl font-bold mb-2">
                {passed ? "Well done!" : "Keep going!"}
              </h1>
              <p className="text-muted-foreground">
                {score} out of {questions.length} correct
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {questions.map((q, i) => {
                const userAnswer = answers[i];
                const correct = userAnswer === q.correctOption;
                return (
                  <div key={q.id} className={`p-4 rounded-xl border ${correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                    <div className="flex items-start gap-3">
                      {correct
                        ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                      <div>
                        <p className="font-medium text-sm mb-1">{q.prompt}</p>
                        {!correct && (
                          <p className="text-sm text-muted-foreground">
                            Correct: <span className="font-medium text-foreground">{q.options[q.correctOption]}</span>
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3">
              {passed && (
                <>
                  {passed && (
                    <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium mb-1">
                      <CheckCircle className="w-4 h-4" />
                      Lesson marked complete
                    </div>
                  )}
                  {isLastLesson ? (
                    <Link
                      href={`/regions/${regionSlug}`}
                      className="flex w-full px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white text-center font-semibold hover:from-green-700 hover:to-green-600 transition-all items-center justify-center gap-2"
                    >
                      View Certificate
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  ) : nextLesson ? (
                    <Link
                      href={`/regions/${regionSlug}/${nextLesson.slug}`}
                      className="flex w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white text-center font-semibold hover:from-purple-700 hover:to-purple-600 transition-all items-center justify-center gap-2"
                    >
                      Next Lesson
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  ) : null}
                </>
              )}
              {!passed && (
                <button
                  onClick={() => {
                    setShuffledQuestions(shuffleQuestions(lesson.questions ?? []));
                    setCurrentQuestion(0);
                    setSelectedAnswer(null);
                    setRevealed(false);
                    setAnswers([]);
                    setDone(false);
                  }}
                  className="w-full px-6 py-3 rounded-lg bg-orange-100 text-orange-700 font-semibold hover:bg-orange-200 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Retry Quiz
                </button>
              )}
              <Link
                href={`/regions/${regionSlug}/${lessonSlug}`}
                className="block w-full px-6 py-3 rounded-lg bg-purple-100 text-purple-600 text-center font-semibold hover:bg-purple-200 transition-all"
              >
                Back to Lesson
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const isCorrect = revealed && selectedAnswer === question.correctOption;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href={`/regions/${regionSlug}/${lessonSlug}`} className="text-purple-600 hover:text-purple-700">
              ← Back to Lesson
            </Link>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-purple-600 to-purple-500 rounded-full"
            />
          </div>
        </motion.div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100"
        >
          <h2 className="text-xl font-bold mb-6">{question.prompt}</h2>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              let cls = "border-purple-100 hover:border-purple-300 hover:bg-purple-50";
              if (revealed) {
                if (index === question.correctOption) cls = "border-green-400 bg-green-50";
                else if (index === selectedAnswer) cls = "border-red-400 bg-red-50";
                else cls = "border-gray-100 bg-gray-50 opacity-50";
              } else if (selectedAnswer === index) {
                cls = "border-purple-500 bg-purple-50";
              }

              const dotSelected = !revealed && selectedAnswer === index;
              const dotCorrect = revealed && index === question.correctOption;
              const dotWrong = revealed && index === selectedAnswer && index !== question.correctOption;

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  disabled={revealed}
                  className={`w-full p-4 rounded-xl text-left transition-all border-2 ${cls}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        dotCorrect ? "border-green-500 bg-green-500"
                        : dotWrong ? "border-red-500 bg-red-500"
                        : dotSelected ? "border-purple-500 bg-purple-500"
                        : "border-gray-300"
                      }`}
                    >
                      {(dotSelected || dotCorrect || dotWrong) && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-xl ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                {isCorrect
                  ? <CheckCircle className="w-4 h-4 text-green-600" />
                  : <XCircle className="w-4 h-4 text-red-600" />}
                <span className={`font-semibold text-sm ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                  {isCorrect ? "Correct!" : "Incorrect"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{question.explanation}</p>
            </motion.div>
          )}

          {!revealed ? (
            <button
              onClick={handleReveal}
              disabled={selectedAnswer === null}
              className={`mt-6 w-full px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                selectedAnswer === null
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600"
              }`}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="mt-6 w-full px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 transition-all"
            >
              {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
