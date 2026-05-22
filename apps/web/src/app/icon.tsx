import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const logoData = await readFile(join(process.cwd(), "public", "genlayer.jpg"));
  const base64 = logoData.toString("base64");
  const dataUrl = `data:image/jpeg;base64,${base64}`;

  return new ImageResponse(
    (
      <div style={{ width: 32, height: 32, position: "relative", display: "flex" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: 32, height: 32, background: "#7c3aed", borderRadius: 6 }} />
        <img src={dataUrl} width={32} height={32} style={{ position: "absolute", top: 0, left: 0, objectFit: "contain", mixBlendMode: "screen" }} />
      </div>
    ),
    { ...size }
  );
}
