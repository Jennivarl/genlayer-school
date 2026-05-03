import Link from "next/link";
import { communitySpotlights, courses, weeklySummaries } from "@genlayer-school/content";

export default function HomePage() {
  const courseCount = courses.length;
  const lessonCount = courses.reduce((total, course) => total + course.lessons.length, 0);

  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Community academy for GenLayer</p>
          <h1>Learn. Build. Certify. Stay ready.</h1>
          <p className="lede">
            GenLayer School is a long-term learning hub for GenLayer builders, Gen-Fren quiz prep, community spotlights, and practical Intelligent Contract education.
          </p>
          <div className="cta-row">
            <Link className="button" href="/learn">Start learning</Link>
            <Link className="button secondary" href="/gen-fren-weekly">Prep for Gen-Fren</Link>
          </div>
        </div>
        <aside className="card highlight">
          <p className="eyebrow">Foundation status</p>
          <h2>{courseCount} tracks, {lessonCount} lessons</h2>
          <p>
            The first content model is live: courses, weekly summaries, community spotlights, and certificate pathways are all represented as typed data.
          </p>
          <div className="pill-row">
            <span className="pill">Python contracts</span>
            <span className="pill">GenLayerJS-ready</span>
            <span className="pill">Community-first</span>
          </div>
        </aside>
      </section>

      <section className="section grid">
        <Link className="card" href="/learn">
          <h3>Academy</h3>
          <p>Structured courses for GenLayer concepts, Intelligent Contracts, and practical builder workflows.</p>
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
