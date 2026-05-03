import { courses, weeklySummaries } from "@genlayer-school/content";

export default function DashboardPage() {
  const lessons = courses.reduce((total, course) => total + course.lessons.length, 0);

  return (
    <div className="page">
      <p className="eyebrow">Learner dashboard</p>
      <h1>Your GenLayer path</h1>
      <p className="lede">This dashboard starts as a public progress model. Accounts and persistence can be added after the public learning loop is stable.</p>

      <section className="section grid">
        <article className="card"><p className="meta">Tracks</p><h2>{courses.length}</h2><p>Learning tracks seeded.</p></article>
        <article className="card"><p className="meta">Lessons</p><h2>{lessons}</h2><p>Lessons available in the foundation catalog.</p></article>
        <article className="card"><p className="meta">Weekly prep</p><h2>{weeklySummaries.length}</h2><p>Gen-Fren prep issue ready.</p></article>
      </section>
    </div>
  );
}
