"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Download, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/app-providers";
import { useEffect, useState } from "react";

type CertificateEligibility = { certificateSlug: string; eligible: boolean };

const regionCertMap: Record<string, string> = {
  nigeria:    "/certificates/nigeria.png.jpg",
  china:      "/certificates/china.png.jpg",
  india:      "/certificates/india.png.jpg",
  indonesia:  "/certificates/indonesia.png.jpg",
  latam:      "/certificates/latam.png.jpg",
  "latam-es": "/certificates/latam.png.jpg",
  "latam-pt": "/certificates/latam.png.jpg",
  russia:     "/certificates/russia.png.jpg",
  korea:      "/certificates/korea.png.jpg",
  turkey:     "/certificates/turkey.png.jpg",
  ukraine:    "/certificates/ukraine.png.jpg",
  vietnam:    "/certificates/vietnam.png.jpg",
  germany:    "/certificates/germany.png.jpg",
  japan:      "/certificates/japan.png.jpg",
  arabic:     "/certificates/arabic.png.jpg",
  persian:    "/certificates/persian.png.jpg",
  bengali:    "/certificates/bengali.png.jpg",
};

export default function CertificatePage() {
  const params = useParams<{ regionSlug: string }>();
  const regionSlug = params.regionSlug ?? "nigeria";
  const auth = useAuth();

  const [eligible, setEligible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const p = new URLSearchParams({ learnerId: auth.learnerId });
    auth.authFetch(`/api/progress?${p}`)
      .then((r) => r.json())
      .then((d) => {
        const certs: CertificateEligibility[] = d.certificates ?? [];
        const cert = certs.find((c) => c.certificateSlug === `${regionSlug}-regional-certificate`);
        setEligible(cert?.eligible ?? false);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.learnerId, regionSlug]);

  useEffect(() => {
    if (!auth.authenticated) return;
    auth.authFetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        const name = d.profile?.displayName ?? d.profile?.username ?? auth.label ?? "";
        setDisplayName(name);
      })
      .catch(() => { setDisplayName(auth.label ?? ""); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.authenticated, auth.learnerId]);

  const nameToShow = displayName || auth.label || "Your Name";

  async function downloadCertificate() {
    const src = regionCertMap[regionSlug];
    if (!src) return;
    const canvas = document.createElement("canvas");
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load"));
      img.src = src;
    });
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);

    // Overlay name on signature line (~41% from left, ~53% from top)
    const nameX = img.naturalWidth * 0.41;
    const nameY = img.naturalHeight * 0.53;
    const fontSize = Math.round(img.naturalWidth * 0.032);
    ctx.font = `bold ${fontSize}px Georgia, "Times New Roman", serif`;
    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "center";
    ctx.fillText(nameToShow, nameX, nameY);

    const link = document.createElement("a");
    link.download = `genlayer-certificate-${regionSlug}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          {loading ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-500 font-semibold mb-4">
              Checking eligibility…
            </div>
          ) : eligible ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold mb-4">
              <CheckCircle className="w-5 h-5" />
              Certificate Earned
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-semibold mb-4">
              <AlertCircle className="w-5 h-5" />
              Not Yet Eligible
            </div>
          )}
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">
            {eligible ? "Congratulations!" : "Your Certificate Preview"}
          </h1>
          <p className="text-muted-foreground">
            {eligible
              ? "You've completed the GenLayer Regional course — download your certificate below"
              : "Complete all lessons to earn this certificate"}
          </p>
        </motion.div>

        {/* Certificate preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-8"
        >
          <div className="w-full relative">
            {regionCertMap[regionSlug] ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={regionCertMap[regionSlug]}
                  alt="GenLayer Certificate"
                  className="w-full rounded-2xl shadow-2xl border border-purple-100"
                  draggable={false}
                />
                {/* Name overlay — mirrors the canvas position used on download */}
                <div
                  className="absolute pointer-events-none"
                  style={{ left: "41%", top: "53%", transform: "translate(-50%, -50%)" }}
                >
                  <span className="font-bold text-[#0f172a] text-sm sm:text-base md:text-lg lg:text-xl" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                    {nameToShow}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-[1.41/1] rounded-2xl shadow-2xl border-2 border-dashed border-purple-200 bg-purple-50 flex flex-col items-center justify-center gap-4 text-center px-8">
                <div className="text-6xl">🏆</div>
                <p className="text-xl font-bold text-purple-700">Certificate Coming Soon</p>
                <p className="text-muted-foreground text-sm">The certificate design for this region is being prepared.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Not eligible notice — shown below the collage, not over it */}
        {!eligible && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 flex items-start gap-4 p-5 rounded-xl bg-amber-50 border border-amber-200"
          >
            <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-amber-700 mb-1">Not yet eligible</p>
              <p className="text-sm text-muted-foreground">Complete all lessons for this region to unlock and download your certificate.</p>
            </div>
            <Link
              href={`/regions/${regionSlug}`}
              className="flex-shrink-0 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-all"
            >
              Continue Learning
            </Link>
          </motion.div>
        )}

        {/* Download */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-3 mb-10"
        >
          <button
            onClick={eligible ? downloadCertificate : undefined}
            disabled={!eligible}
            className={`px-10 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 transition-all shadow-lg ${
              eligible
                ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 hover:shadow-xl"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Download className="w-6 h-6" />
            Download Certificate
          </button>
        </motion.div>

        {/* What's next */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-8 border border-purple-100"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">What&apos;s Next?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/certificates" className="p-6 rounded-xl bg-purple-50 border border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all text-center">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="font-semibold mb-2">All Certificates</h3>
              <p className="text-sm text-muted-foreground">View all your earned certificates</p>
            </Link>
            <Link href="/regions" className="p-6 rounded-xl bg-purple-50 border border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all text-center">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="font-semibold mb-2">Explore More Regions</h3>
              <p className="text-sm text-muted-foreground">Learn GenLayer in other languages</p>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
