import { weeklySummaries } from "@genlayer-school/content";
import { QuizCard } from "@/components/quiz-card";

export default function GenFrenWeeklyPage() {
  return (
    <div className="page">
      <p className="eyebrow">Weekly summary and prep quiz</p>
      <h1>Gen-Fren Weekly</h1>
      <p className="lede">A recurring digest that helps the community review GenLayer updates, sharpen core concepts, and prepare for Gen-Fren quizzes.</p>

      <section className="section list">
        {weeklySummaries.map((issue) => (
          <article className="card" key={issue.slug}>
            <p className="meta">Week of {issue.weekOf}</p>
            <h2>{issue.title}</h2>
            <p>{issue.summary}</p>
            <div className="pill-row">
              {issue.keyConcepts.map((concept) => <span className="pill" key={concept}>{concept}</span>)}
            </div>
            <section className="section grid two">
              {issue.links.map((link) => (
                <a className="card" href={link.url} key={link.title}>
                  <h3>{link.title}</h3>
                  <p>{link.description}</p>
                </a>
              ))}
            </section>
            <section className="section">
              <QuizCard quiz={issue.quiz} quizKind="weekly" />
            </section>
          </article>
        ))}
      </section>
    </div>
  );
}
