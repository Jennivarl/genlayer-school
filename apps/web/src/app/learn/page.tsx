import Link from "next/link";
import { courses, regionalTracks } from "@genlayer-school/content";

export default function LearnPage() {
  return (
    <div className="page">
      <p className="eyebrow">Academy</p>
      <h1>Learning tracks</h1>
      <p className="lede">Start with GenLayer fundamentals, then move toward practical Intelligent Contract and frontend integration work.</p>

      <section className="section card">
        <p className="eyebrow">Regional school</p>
        <h2>Learn GenLayer in native languages</h2>
        <p>
          The regional school now includes {regionalTracks.length} native-language tracks for community members across China, India, Indonesia, LATAM, Nigeria, Russia, Korea, Turkey, Ukraine, and Vietnam.
        </p>
        <Link className="button" href="/regions">Open regional school</Link>
      </section>

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
