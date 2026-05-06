import { notFound } from "next/navigation";
import { ContentRenderer } from "@/components/content-renderer";
import { QuizCard } from "@/components/quiz-card";
import { getPublishedWeeklySummary } from "@/lib/backend/public-content";

export const dynamic = "force-dynamic";

export default async function WeeklyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const issue = await getPublishedWeeklySummary(slug);
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
