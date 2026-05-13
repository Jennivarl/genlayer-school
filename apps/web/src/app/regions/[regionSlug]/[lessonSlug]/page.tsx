import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegionalTrack, regionalTracks } from "@genlayer-school/content";
import { ContentRenderer } from "@/components/content-renderer";
import { LessonAction } from "@/components/lesson-action";

export function generateStaticParams() {
  return regionalTracks.flatMap((track) => track.lessons.map((lesson) => ({
    regionSlug: track.slug,
    lessonSlug: lesson.slug,
  })));
}

export default async function RegionalLessonPage({ params }: { params: Promise<{ regionSlug: string; lessonSlug: string }> }) {
  const { regionSlug, lessonSlug } = await params;
  const track = getRegionalTrack(regionSlug);
  const lesson = track?.lessons.find((item) => item.slug === lessonSlug) ?? null;
  if (!track || !lesson) notFound();

  return (
    <div className="page readable" lang={track.locale}>
      <p className="eyebrow">{track.nativeRegionName} - {track.nativeLanguageName}</p>
      <h1>{lesson.title}</h1>
      <p className="lede">{lesson.summary}</p>
      <div className="cta-row">
        <LessonAction courseSlug={track.slug} lessonSlug={lesson.slug} initiallyCompleted={false} />
        <Link className="button secondary" href={`/regions/${track.slug}`}>Back to region</Link>
      </div>

      <section className="section card">
        <h2>Objectives</h2>
        <ul>
          {lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}
        </ul>
      </section>

      <section className="section">
        <ContentRenderer blocks={lesson.content} />
      </section>
    </div>
  );
}
