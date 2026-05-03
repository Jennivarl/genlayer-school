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
                <div className="list-item" key={lesson.slug}>
                  <div>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.summary}</p>
                  </div>
                  <span className="meta">{lesson.durationMinutes} min</span>
                </div>
              ))}
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
