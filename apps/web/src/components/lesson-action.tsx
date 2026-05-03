"use client";

import { useState } from "react";
import { useAuth } from "./app-providers";

type LessonActionProps = {
  courseSlug: string;
  lessonSlug: string;
  initiallyCompleted: boolean;
};

export function LessonAction({ courseSlug, lessonSlug, initiallyCompleted }: LessonActionProps) {
  const auth = useAuth();
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [saving, setSaving] = useState(false);

  async function toggleLesson() {
    setSaving(true);
    const nextCompleted = !completed;
    const response = await auth.authFetch("/api/progress/lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseSlug, lessonSlug, completed: nextCompleted }),
    });
    if (response.ok) setCompleted(nextCompleted);
    setSaving(false);
  }

  return (
    <button className="button secondary compact" type="button" onClick={toggleLesson} disabled={saving}>
      {saving ? "Saving" : completed ? "Completed" : "Mark done"}
    </button>
  );
}
