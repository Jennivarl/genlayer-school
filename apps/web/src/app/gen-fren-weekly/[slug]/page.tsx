import { notFound } from "next/navigation";
import { getWeeklySummary, weeklySummaries } from "@genlayer-school/content";
import { ContentRenderer } from "@/components/content-renderer";
import { QuizCard } from "@/components/quiz-card";

export function generateStaticParams() {
  return weeklySummaries.map((summary) => ({ slug: summary.slug }));
}

export default async function WeeklyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const issue = getWeeklySummary(slug);
  if (!issue) notFound();

  return (
    <div className="page readable">
      <p className="eyebrow">Week of {issue.weekOf}</p>
      <h1>{issue.title}</h1>
      <p className="lede">{issue.summary}</p>
      <section className="section">
        <ContentRenderer blocks={issue.content} />
      </section>
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
    </div>
  );
}
