import Link from "next/link";
import { courses } from "@genlayer-school/content";
import { getPublishedRegionalTracks } from "@/lib/backend/public-content";

export default async function LearnPage() {
  const regionalTracks = await getPublishedRegionalTracks();

  return (
    <div className="page">
      <p className="eyebrow">Regional GenLayer School</p>
      <h1>Choose your native-language track.</h1>
      <p className="lede">
        Start with the regional classroom that matches how your community speaks, learns, and teaches. Each track gives members basic GenLayer knowledge, a short quiz, and a path toward a regional certificate.
      </p>

      <section className="section region-grid">
        {regionalTracks.map((track) => (
          <article className="card region-card" key={track.slug} lang={track.locale}>
            <p className="meta">{track.regionName} - {track.languageName}</p>
            <h2>{track.nativeRegionName}</h2>
            <p>{track.description}</p>
            <div className="pill-row">
              <span className="pill">{track.nativeLanguageName}</span>
              <span className="pill">{track.quiz.questions.length} quiz questions</span>
            </div>
            <div className="cta-row">
              <Link className="button" href={`/regions/${track.slug}`}>Start track</Link>
            </div>
          </article>
        ))}
      </section>

      <section className="section">
        <p className="eyebrow">Deep-dive academy</p>
        <h2>Classic builder courses</h2>
        <p className="lede">After the regional basics, use these tracks for deeper GenLayer concepts, Intelligent Contracts, and frontend integration work.</p>
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
