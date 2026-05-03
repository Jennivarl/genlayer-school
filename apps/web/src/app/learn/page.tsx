export const dynamic = "force-dynamic";

import Link from "next/link";
import { courses } from "@genlayer-school/content";
import { getProgress } from "@/lib/backend/progress-store";
import { LessonAction } from "@/components/lesson-action";
import { QuizCard } from "@/components/quiz-card";

export default async function LearnPage() {
  const progress = await getProgress();
  const completedLessons = new Set(progress.completedLessons);

  return (
    <div className="page">
      <p className="eyebrow">Academy</p>
      <h1>Learning tracks</h1>
      <p className="lede">Start with GenLayer fundamentals, then move toward practical Intelligent Contract and frontend integration work.</p>

      <section className="section grid two">
        {courses.map((course) => (
          <article className="card" key={course.slug}>
            <p className="meta">{course.level}</p>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <div className="pill-row">
              {course.outcomes.map((outcome) => <span className="pill" key={outcome}>{outcome}</span>)}
            </div>
            <div className="section list">
              {course.lessons.map((lesson) => {
                const completed = completedLessons.has(`${course.slug}/${lesson.slug}`);
                return (
                  <div className="list-item" key={lesson.slug}>
                    <div>
                      <h3>{lesson.title}</h3>
                      <p>{lesson.summary}</p>
                      <span className="meta">{lesson.durationMinutes} min</span>
                    </div>
                    <LessonAction courseSlug={course.slug} lessonSlug={lesson.slug} initiallyCompleted={completed} />
                  </div>
                );
              })}
            </div>
            <div className="section">
              <QuizCard quiz={course.quiz} quizKind="course" />
            </div>
          </article>
        ))}
      </section>

      <div className="cta-row">
        <Link className="button secondary" href="/certificates">View certificate pathway</Link>
      </div>
    </div>
  );
}

