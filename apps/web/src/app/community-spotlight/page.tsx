import { communitySpotlights } from "@genlayer-school/content";

export default function CommunitySpotlightPage() {
  return (
    <div className="page">
      <p className="eyebrow">Monthly community spotlight</p>
      <h1>GenLayer community spotlight</h1>
      <p className="lede">A monthly home for ecosystem stories, builder wins, tutorials, project updates, and community momentum.</p>

      <section className="section list">
        {communitySpotlights.map((spotlight) => (
          <article className="card" key={spotlight.slug}>
            <p className="meta">{spotlight.month}</p>
            <h2>{spotlight.title}</h2>
            <p><strong>Featured builder:</strong> {spotlight.featuredBuilder}</p>
            <p><strong>Featured project:</strong> {spotlight.featuredProject}</p>
            <div className="grid">
              {spotlight.highlights.map((item) => (
                <div className="card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
