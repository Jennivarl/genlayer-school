import { notFound } from "next/navigation";
import { communitySpotlights, getCommunitySpotlight } from "@genlayer-school/content";
import { ContentRenderer } from "@/components/content-renderer";

export function generateStaticParams() {
  return communitySpotlights.map((spotlight) => ({ slug: spotlight.slug }));
}

export default async function SpotlightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const spotlight = getCommunitySpotlight(slug);
  if (!spotlight) notFound();

  return (
    <div className="page readable">
      <p className="eyebrow">{spotlight.month}</p>
      <h1>{spotlight.title}</h1>
      <p className="lede">Featured builder: {spotlight.featuredBuilder}. Featured project: {spotlight.featuredProject}.</p>
      <section className="section grid">
        {spotlight.highlights.map((item) => (
          <article className="card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </section>
      <section className="section">
        <ContentRenderer blocks={spotlight.content} />
      </section>
    </div>
  );
}
