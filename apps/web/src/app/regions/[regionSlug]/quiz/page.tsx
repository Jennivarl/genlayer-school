import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegionalTrack, regionalTracks } from "@genlayer-school/content";
import { QuizCard } from "@/components/quiz-card";

export function generateStaticParams() {
  return regionalTracks.map((track) => ({ regionSlug: track.slug }));
}

export default async function RegionalQuizPage({ params }: { params: Promise<{ regionSlug: string }> }) {
  const { regionSlug } = await params;
  const track = getRegionalTrack(regionSlug);
  if (!track) notFound();

  return (
    <div className="page readable" lang={track.locale}>
      <p className="eyebrow">{track.regionName} regional checkpoint</p>
      <h1>{track.quiz.title}</h1>
      <p className="lede">Pass this quiz to unlock progress toward the {track.certificateTitle}.</p>
      <section className="section">
        <QuizCard quiz={track.quiz} quizKind="regional" />
      </section>
      <div className="cta-row">
        <Link className="button secondary" href={`/regions/${track.slug}`}>Back to region</Link>
      </div>
    </div>
  );
}
