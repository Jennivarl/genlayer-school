import Link from "next/link";
import { courses } from "@genlayer-school/content";

export default function LearnPage() {
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
              {course.lessons.map((lesson) => (
                <Link className="list-item" href={`/learn/${course.slug}/${lesson.slug}`} key={lesson.slug}>
                  <div>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.summary}</p>
                    <span className="meta">{lesson.durationMinutes} min</span>
                  </div>
                  <span className="pill">Open</span>
                </Link>
              ))}
            </div>
            <div className="cta-row">
              <Link className="button" href={`/learn/${course.slug}`}>View course</Link>
              <Link className="button secondary" href={`/learn/${course.slug}/quiz`}>Take quiz</Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
