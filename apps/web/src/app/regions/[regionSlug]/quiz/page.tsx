"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { CheckCircle, XCircle, Award, ArrowRight, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/app-providers";

type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctOption: number;
  explanation: string;
};

type Quiz = {
  slug: string;
  title: string;
  passPercent: number;
  questions: QuizQuestion[];
};

type RegionalTrack = {
  slug: string;
  regionName: string;
  quiz: Quiz;
};

type QuizResult = {
  percent: number;
  passed: boolean;
  score: number;
  total: number;
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

export default function QuizPage() {
  const params = useParams<{ regionSlug: string }>();
  const regionSlug = params.regionSlug ?? "";
  const auth = useAuth();

  const [track, setTrack] = useState<RegionalTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    if (!regionSlug) return;
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((d) => {
        const tracks: RegionalTrack[] = d.regionalTracks ?? [];
        setTrack(tracks.find((t) => t.slug === regionSlug) ?? null);
      })
      .finally(() => setLoading(false));
  }, [regionSlug]);

  if (loading) return <Spinner />;

  if (!track) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Quiz not found.</p>
          <Link href={`/regions/${regionSlug}`} className="text-purple-600 hover:underline">← Back to Course</Link>
        </div>
      </div>
    );
  }

  const quiz = track.quiz;
  const questions = quiz.questions;
  const question = questions[currentQuestion];

  async function handleNext() {
    if (selectedAnswer === null || !question) return;

    const newAnswers = { ...answers, [question.id]: selectedAnswer };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setSubmitting(true);
      try {
        const res = await auth.authFetch("/api/quizzes/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            learnerId: auth.learnerId,
            quizSlug: quiz.slug,
            quizKind: "regional",
            answers: newAnswers,
          }),
        });
        const data = await res.json();
        if (data.attempt) {
          setResult(data.attempt);
        } else {
          setResult({ percent: 0, passed: false, score: 0, total: questions.length });
        }
      } catch {
        setResult({ percent: 0, passed: false, score: 0, total: questions.length });
      } finally {
        setSubmitting(false);
      }
    }
  }

  function handleRetry() {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers({});
    setResult(null);
  }

  if (result) {
    const passed = result.passed;
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white rounded-2xl p-8 shadow-lg border-2 ${passed ? "border-green-300" : "border-red-300"}`}
          >
            <div className="text-center mb-8">
              {passed ? (
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
              )}
              <h1 className="text-3xl font-bold mb-2">
                {passed ? "Congratulations!" : "Keep Trying!"}
              </h1>
              <p className="text-muted-foreground">
                {passed
                  ? "You've passed the quiz and earned your certificate"
                  : `You need ${quiz.passPercent}% or higher to pass`}
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">Your Score</span>
                <span className={`text-3xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>
                  {result.percent}%
                </span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.percent}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full rounded-full ${passed ? "bg-gradient-to-r from-green-500 to-green-400" : "bg-gradient-to-r from-red-500 to-red-400"}`}
                />
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                {result.score} out of {result.total} questions correct
              </div>
            </div>

            <div className="space-y-3">
              {passed ? (
                <Link
                  href={`/regions/${regionSlug}/certificate`}
                  className="flex w-full px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white text-center font-semibold hover:from-green-700 hover:to-green-600 transition-all items-center justify-center gap-2"
                >
                  <Award className="w-5 h-5" />
                  Claim Certificate
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <button
                  onClick={handleRetry}
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold hover:from-purple-700 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Retry Quiz
                </button>
              )}
              <Link
                href={`/regions/${regionSlug}`}
                className="block w-full px-6 py-3 rounded-lg bg-purple-100 text-purple-600 text-center font-semibold hover:bg-purple-200 transition-all"
              >
                Back to Course
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href={`/regions/${regionSlug}`} className="text-purple-600 hover:text-purple-700">
              ← Back to Course
            </Link>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
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
          <h2 className="text-2xl font-bold mb-6">{question.prompt}</h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(index)}
                className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                  selectedAnswer === index
                    ? "border-purple-500 bg-purple-50"
                    : "border-purple-100 hover:border-purple-300 hover:bg-purple-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedAnswer === index ? "border-purple-500 bg-purple-500" : "border-gray-300"
                    }`}
                  >
                    {selectedAnswer === index && <div className="w-3 h-3 bg-white rounded-full" />}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={selectedAnswer === null || submitting}
            className={`mt-6 w-full px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              selectedAnswer === null || submitting
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600"
            }`}
          >
            {submitting
              ? "Submitting…"
              : currentQuestion < questions.length - 1
              ? "Next Question"
              : "Submit Quiz"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
