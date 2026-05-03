import Link from "next/link";
import { notFound } from "next/navigation";
import { courses, getLesson } from "@genlayer-school/content";
import { ContentRenderer } from "@/components/content-renderer";
import { LessonAction } from "@/components/lesson-action";
import { getProgress } from "@/lib/backend/progress-store";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return courses.flatMap((course) => course.lessons.map((lesson) => ({
    courseSlug: course.slug,
    lessonSlug: lesson.slug,
  })));
}

export default async function LessonPage({ params }: { params: Promise<{ courseSlug: string; lessonSlug: string }> }) {
  const { courseSlug, lessonSlug } = await params;
  const match = getLesson(courseSlug, lessonSlug);
  if (!match) notFound();

  const progress = await getProgress();
  const completed = progress.completedLessons.includes(`${match.course.slug}/${match.lesson.slug}`);

  return (
    <div className="page readable">
      <p className="eyebrow">{match.course.title}</p>
      <h1>{match.lesson.title}</h1>
      <p className="lede">{match.lesson.summary}</p>
      <div className="cta-row">
        <LessonAction courseSlug={match.course.slug} lessonSlug={match.lesson.slug} initiallyCompleted={completed} />
        <Link className="button secondary" href={`/learn/${match.course.slug}`}>Back to course</Link>
      </div>

      <section className="section card">
        <h2>Objectives</h2>
        <ul>
          {match.lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}
        </ul>
      </section>

      <section className="section">
        <ContentRenderer blocks={match.lesson.content} />
      </section>
    </div>
  );
}
