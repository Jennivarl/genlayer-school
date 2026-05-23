import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const alt = "GenLayer Regional School";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const logoData = await readFile(join(process.cwd(), "public", "genlayer-logo.png"));
  const base64 = logoData.toString("base64");
  const dataUrl = `data:image/jpeg;base64,${base64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #f5f3ff 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background blobs */}
        <div style={{ position: "absolute", top: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(124,58,237,0.12)" }} />
        <div style={{ position: "absolute", bottom: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(124,58,237,0.12)" }} />

        {/* Logo */}
        <div style={{ width: 80, height: 80, marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={dataUrl} width={80} height={80} style={{ objectFit: "contain" }} />
        </div>

        {/* Title */}
        <div style={{ fontSize: 56, fontWeight: 800, color: "#1a1a2e", marginBottom: 16, letterSpacing: "-1px" }}>
          GenLayer Regional School
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 26, color: "#6b7280", marginBottom: 48, textAlign: "center", maxWidth: 700 }}>
          Learn GenLayer in your language. Earn certificates. Join the global ecosystem.
        </div>

        {/* Flags */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {["ng", "cn", "in", "id", "mx", "br", "ru", "kr", "tr", "ua", "vn"].map((code) => (
            <img key={code} src={`https://flagcdn.com/w40/${code}.png`} width={40} height={27} style={{ borderRadius: 4, objectFit: "cover" }} />
          ))}
        </div>

        {/* Domain */}
        <div style={{ position: "absolute", bottom: 32, fontSize: 18, color: "#7c3aed", fontWeight: 600 }}>
          gen-school.fun
        </div>
      </div>
    ),
    { ...size }
  );
}
