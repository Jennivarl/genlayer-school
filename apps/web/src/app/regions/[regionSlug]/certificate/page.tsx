import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegionalTrack, regionalTracks } from "@genlayer-school/content";
import { RegionalCertificate } from "@/components/regional-certificate";

export function generateStaticParams() {
  return regionalTracks.map((track) => ({ regionSlug: track.slug }));
}

export default async function RegionalCertificatePage({ params }: { params: Promise<{ regionSlug: string }> }) {
  const { regionSlug } = await params;
  const track = getRegionalTrack(regionSlug);
  if (!track) notFound();

  return (
    <div className="page" lang={track.locale}>
      <p className="eyebrow">{track.regionName} certificate</p>
      <h1>{track.certificateTitle}</h1>
      <p className="lede">
        Preview and download your regional GenLayer certificate. The final artwork can be swapped in later while keeping the username overlay and download flow.
      </p>
      <div className="cta-row">
        <Link className="button secondary" href={`/regions/${track.slug}`}>Back to region</Link>
        <Link className="button secondary" href="/dashboard">Profile</Link>
      </div>

      <RegionalCertificate track={track} />
    </div>
  );
}
