"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Calendar, BookOpen, Trophy, ExternalLink, ArrowRight, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/app-providers";
import { ContentRenderer } from "@/components/content-renderer";
import type { ContentBlock } from "@genlayer-school/content";

type SpotlightItem = { title: string; description: string; url?: string };
type QuizQuestion = { id: string; prompt: string; options: string[]; correctOption: number; explanation: string };
type Quiz = { slug: string; title: string; passPercent: number; questions: QuizQuestion[] };
type WeeklySummary = {
  slug: string;
  weekOf: string;
  title: string;
  summary: string;
  keyConcepts: string[];
  links: SpotlightItem[];
  content: ContentBlock[];
  quiz: Quiz;
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

function formatWeekDate(weekOf: string): string {
  const [year, month, day] = weekOf.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

type QuizState = "idle" | "active" | "submitted";

export default function GenFrenWeeklyPage() {
  const auth = useAuth();
  const [weekly, setWeekly] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<{ percent: number; passed: boolean; score: number; total: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((d) => {
        const summaries: WeeklySummary[] = d.weeklySummaries ?? [];
        setWeekly(summaries[summaries.length - 1] ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  if (!weekly) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No weekly prep available yet.</p>
      </div>
    );
  }

  const quiz = weekly.quiz;
  const question = quiz.questions[currentQ];

  async function handleNext() {
    if (selected === null || !question) return;
    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);

    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else {
      setSubmitting(true);
      try {
        const res = await auth.authFetch("/api/quizzes/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            learnerId: auth.learnerId,
            quizSlug: quiz.slug,
            quizKind: "weekly",
            answers: newAnswers,
          }),
        });
        const data = await res.json();
        if (data.attempt) setResult(data.attempt);
        else setResult({
          percent: Math.round((Object.values(newAnswers).filter((v, i) => v === quiz.questions[i]?.correctOption).length / quiz.questions.length) * 100),
          passed: false,
          score: 0,
          total: quiz.questions.length,
        });
      } catch {
        setResult({ percent: 0, passed: false, score: 0, total: quiz.questions.length });
      } finally {
        setSubmitting(false);
        setQuizState("submitted");
      }
    }
  }

  function resetQuiz() {
    setQuizState("idle");
    setCurrentQ(0);
    setAnswers({});
    setSelected(null);
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold mb-4">
            <Calendar className="w-4 h-4" />
            Week of {formatWeekDate(weekly.weekOf)}
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-4">
            Weekly Gen-Fren Prep
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{weekly.summary}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl p-8 text-white shadow-xl mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{weekly.title}</h2>
              <p className="text-purple-100">{quiz.questions.length} practice questions · {quiz.passPercent}% to pass</p>
            </div>
          </div>
          <button
            onClick={() => setQuizState("active")}
            className="w-full py-4 px-6 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
          >
            Start Practice Quiz
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {quizState === "active" && question && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-muted-foreground">
                Question {currentQ + 1} of {quiz.questions.length}
              </h3>
              <button onClick={resetQuiz} className="text-sm text-muted-foreground hover:text-foreground">
                Cancel
              </button>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-purple-500 rounded-full transition-all"
                style={{ width: `${((currentQ + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>
            <h2 className="text-xl font-bold mb-6">{question.prompt}</h2>
            <div className="space-y-3 mb-6">
              {question.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full p-4 rounded-xl text-left transition-all border-2 flex items-center gap-3 ${
                    selected === i ? "border-purple-500 bg-purple-50" : "border-purple-100 hover:border-purple-300"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selected === i ? "border-purple-500 bg-purple-500" : "border-gray-300"
                  }`}>
                    {selected === i && <div className="w-3 h-3 bg-white rounded-full" />}
                  </div>
                  {option}
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={selected === null || submitting}
              className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                selected === null || submitting
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600"
              }`}
            >
              {submitting ? "Submitting…" : currentQ < quiz.questions.length - 1 ? "Next Question" : "Submit Quiz"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {quizState === "submitted" && result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white rounded-2xl p-8 shadow-lg border-2 mb-8 ${result.passed ? "border-green-300" : "border-red-300"}`}
          >
            <div className="text-center mb-6">
              {result.passed ? (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
              )}
              <h2 className="text-2xl font-bold mb-2">{result.passed ? "Great work!" : "Keep studying!"}</h2>
              <p className={`text-4xl font-bold ${result.passed ? "text-green-600" : "text-red-600"}`}>{result.percent}%</p>
              <p className="text-muted-foreground mt-2">{result.score} of {result.total} correct</p>
            </div>
            <button
              onClick={resetQuiz}
              className="w-full py-3 rounded-lg bg-purple-100 text-purple-600 font-semibold hover:bg-purple-200 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold">Key Concepts</h2>
            </div>
            <div className="space-y-3">
              {weekly.keyConcepts.map((concept, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-purple-50 border border-purple-100">
                  <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-sm">{concept}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <ExternalLink className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold">Resources</h2>
            </div>
            <div className="space-y-4">
              {weekly.links.map((link, i) => (
                <div key={i} className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <div className="font-semibold mb-1">{link.title}</div>
                  <p className="text-sm text-muted-foreground mb-2">{link.description}</p>
                  {link.url && (
                    <a href={link.url} target="_blank" rel="noopener noreferrer"
                      className="text-sm font-medium text-purple-600 hover:underline flex items-center gap-1">
                      Open <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {weekly.content.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">Study Notes</h2>
            <ContentRenderer blocks={weekly.content} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Test Your Knowledge?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Study the key concepts above, then take the practice quiz to prepare for the weekly community event
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => { setQuizState("active"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              Take Practice Quiz
            </button>
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-lg bg-purple-100 text-purple-600 font-semibold hover:bg-purple-200 transition-all flex items-center justify-center gap-2"
            >
              Back to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
