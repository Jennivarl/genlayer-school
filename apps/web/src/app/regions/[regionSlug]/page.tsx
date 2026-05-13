import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegionalTrack, regionalTracks } from "@genlayer-school/content";

export function generateStaticParams() {
  return regionalTracks.map((track) => ({ regionSlug: track.slug }));
}

export default async function RegionPage({ params }: { params: Promise<{ regionSlug: string }> }) {
  const { regionSlug } = await params;
  const track = getRegionalTrack(regionSlug);
  if (!track) notFound();

  return (
    <div className="page" lang={track.locale}>
      <p className="eyebrow">{track.regionName} - {track.languageName}</p>
      <h1>{track.title}</h1>
      <p className="lede">{track.description}</p>

      <section className="section grid two">
        <article className="card">
          <h2>{track.nativeRegionName}</h2>
          <p>{track.unityMessage}</p>
          <div className="pill-row">
            <span className="pill">{track.nativeLanguageName}</span>
            <span className="pill">{track.certificateTitle}</span>
          </div>
        </article>
        <article className="card">
          <h2>{track.quiz.title}</h2>
          <p className="meta">Pass mark: {track.quiz.passPercent}%</p>
          <p>Complete the regional basics, then pass the quiz to move toward the regional certificate.</p>
          <div className="cta-row">
            <Link className="button" href={`/regions/${track.slug}/quiz`}>Take regional quiz</Link>
            <Link className="button secondary" href={`/regions/${track.slug}/certificate`}>Preview certificate</Link>
          </div>
        </article>
      </section>

      <section className="section list">
        {track.lessons.map((lesson) => (
          <Link className="list-item" href={`/regions/${track.slug}/${lesson.slug}`} key={lesson.slug}>
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
