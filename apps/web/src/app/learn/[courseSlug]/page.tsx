import Link from "next/link";
import { notFound } from "next/navigation";
import { courses, getCourse } from "@genlayer-school/content";

export function generateStaticParams() {
  return courses.map((course) => ({ courseSlug: course.slug }));
}

export default async function CoursePage({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();

  return (
    <div className="page">
      <p className="eyebrow">{course.level} course</p>
      <h1>{course.title}</h1>
      <p className="lede">{course.description}</p>

      <section className="section grid two">
        <article className="card">
          <h2>Outcomes</h2>
          <ul>
            {course.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
          </ul>
        </article>
        <article className="card">
          <h2>Checkpoint</h2>
          <p>{course.quiz.title}</p>
          <p className="meta">Pass mark: {course.quiz.passPercent}%</p>
          <Link className="button" href={`/learn/${course.slug}/quiz`}>Take course quiz</Link>
        </article>
      </section>

      <section className="section list">
        {course.lessons.map((lesson) => (
          <Link className="list-item" href={`/learn/${course.slug}/${lesson.slug}`} key={lesson.slug}>
            <div>
              <h3>{lesson.title}</h3>
              <p>{lesson.summary}</p>
            </div>
            <span className="meta">{lesson.durationMinutes} min</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
