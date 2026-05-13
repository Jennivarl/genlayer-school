import Link from "next/link";
import { communitySpotlights, courses, regionalTracks, weeklySummaries } from "@genlayer-school/content";

export default function HomePage() {
  const courseCount = courses.length;
  const lessonCount = courses.reduce((total, course) => total + course.lessons.length, 0);
  const regionalLessonCount = regionalTracks.reduce((total, track) => total + track.lessons.length, 0);

  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Regional GenLayer School</p>
          <h1>Learn GenLayer in your native language.</h1>
          <p className="lede">
            GenLayer School helps community members understand the GenLayer ecosystem in the languages they think, build, and teach in. Each region learns the same AI-native foundation, then comes together as one global GenLayer community.
          </p>
          <div className="cta-row">
            <Link className="button" href="/regions">Choose your region</Link>
            <Link className="button secondary" href="/gen-fren-weekly">Prep for Gen-Fren</Link>
          </div>
        </div>
        <aside className="card highlight">
          <p className="eyebrow">Global classroom</p>
          <h2>{regionalTracks.length} regions, {regionalLessonCount} regional lessons</h2>
          <p>
            Regional GenLayer School starts with China, India, Indonesia, LATAM, Nigeria, Russia, Korea, Turkey, Ukraine, and Vietnam. LATAM supports Spanish and Portuguese. Each track includes native-language basics, a quiz, and a certificate path.
          </p>
          <div className="pill-row">
            <span className="pill">Native-language learning</span>
            <span className="pill">Regional certificates</span>
            <span className="pill">One GenLayer community</span>
          </div>
        </aside>
      </section>

      <section className="section">
        <p className="eyebrow">Choose a regional classroom</p>
        <div className="region-grid">
          {regionalTracks.map((track) => (
            <Link className="card region-card" href={`/regions/${track.slug}`} key={track.slug} lang={track.locale}>
              <span className="meta">{track.regionName} - {track.languageName}</span>
              <h3>{track.nativeRegionName}</h3>
              <p>{track.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section grid">
        <Link className="card" href="/learn">
          <h3>Academy</h3>
          <p>{courseCount} classic tracks and {lessonCount} lessons remain available for deeper GenLayer concepts and builder workflows.</p>
        </Link>
        <Link className="card" href="/community-spotlight">
          <h3>Monthly Spotlight</h3>
          <p>{communitySpotlights[0]?.title}</p>
        </Link>
        <Link className="card" href="/gen-fren-weekly">
          <h3>Gen-Fren Weekly</h3>
          <p>{weeklySummaries[0]?.title}</p>
        </Link>
      </section>
    </div>
  );
}
