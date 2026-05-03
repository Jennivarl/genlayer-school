import Link from "next/link";
import { weeklySummaries } from "@genlayer-school/content";

export default function GenFrenWeeklyPage() {
  return (
    <div className="page">
      <p className="eyebrow">Weekly summary and prep quiz</p>
      <h1>Gen-Fren Weekly</h1>
      <p className="lede">A recurring digest that helps the community review GenLayer updates, sharpen core concepts, and prepare for Gen-Fren quizzes.</p>

      <section className="section list">
        {weeklySummaries.map((issue) => (
          <Link className="card" href={`/gen-fren-weekly/${issue.slug}`} key={issue.slug}>
            <p className="meta">Week of {issue.weekOf}</p>
            <h2>{issue.title}</h2>
            <p>{issue.summary}</p>
            <div className="pill-row">
              {issue.keyConcepts.map((concept) => <span className="pill" key={concept}>{concept}</span>)}
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
