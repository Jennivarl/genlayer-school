import type { ReactNode } from "react";

export function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <article className="card">
      <p className="meta">{label}</p>
      <h3>{value}</h3>
      <p>{note}</p>
    </article>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="section">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <div className="lede">{children}</div>
    </section>
  );
}
