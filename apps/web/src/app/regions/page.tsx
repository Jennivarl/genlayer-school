import Link from "next/link";
import { RegionalProgressCards } from "@/components/regional-progress-cards";
import { getPublishedRegionalTracks } from "@/lib/backend/public-content";

export default async function RegionsPage() {
  const regionalTracks = await getPublishedRegionalTracks();

  return (
    <div className="page">
      <p className="eyebrow">Regional GenLayer School</p>
      <h1>One ecosystem, many native languages.</h1>
      <p className="lede">
        Choose a regional classroom to learn GenLayer basics in a familiar language, take a short quiz, and work toward a certificate designed for that region.
      </p>

      <RegionalProgressCards tracks={regionalTracks} />

      <section className="section region-grid">
        {regionalTracks.map((track) => (
          <article className="card region-card" key={track.slug} lang={track.locale}>
            <p className="meta">{track.regionName} - {track.languageName}</p>
            <h2>{track.nativeRegionName}</h2>
            <p>{track.description}</p>
            <p>{track.unityMessage}</p>
            <div className="pill-row">
              <span className="pill">{track.nativeLanguageName}</span>
              <span className="pill">{track.lessons.length} lesson</span>
              <span className="pill">{track.quiz.questions.length} questions</span>
            </div>
            <div className="cta-row">
              <Link className="button" href={`/regions/${track.slug}`}>Open classroom</Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
