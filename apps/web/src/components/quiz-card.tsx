"use client";

import { useState } from "react";
import type { Quiz, QuizKind } from "@genlayer-school/content";
import { useAuth } from "./app-providers";

type QuizCardProps = {
  quiz: Quiz;
  quizKind: QuizKind;
};

export function QuizCard({ quiz, quizKind }: QuizCardProps) {
  const auth = useAuth();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; total: number; percent: number; passed: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  async function submitQuiz() {
    setSaving(true);
    const response = await auth.authFetch("/api/quizzes/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizSlug: quiz.slug, quizKind, answers }),
    });
    const data = await response.json() as { attempt?: { score: number; total: number; percent: number; passed: boolean } };
    if (response.ok && data.attempt) setResult(data.attempt);
    setSaving(false);
  }

  const allAnswered = quiz.questions.every((question) => answers[question.id] !== undefined);

  return (
    <article className="card">
      <p className="meta">Pass mark: {quiz.passPercent}%</p>
      <h2>{quiz.title}</h2>
      <div className="list">
        {quiz.questions.map((question) => (
          <fieldset className="quiz-question" key={question.id}>
            <legend>{question.prompt}</legend>
            {question.options.map((option, index) => (
              <label key={option}>
                <input
                  checked={answers[question.id] === index}
                  name={question.id}
                  onChange={() => setAnswers((current) => ({ ...current, [question.id]: index }))}
                  type="radio"
                />
                {option}
              </label>
            ))}
          </fieldset>
        ))}
      </div>
      <div className="cta-row">
        <button className="button" disabled={!allAnswered || saving} onClick={submitQuiz} type="button">
          {saving ? "Submitting" : "Submit quiz"}
        </button>
        {result && (
          <span className="pill">
            {result.score}/{result.total} - {result.percent}% - {result.passed ? "Passed" : "Try again"}
          </span>
        )}
      </div>
    </article>
  );
}
