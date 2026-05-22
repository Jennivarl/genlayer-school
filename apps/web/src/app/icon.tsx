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
      <img
        src={dataUrl}
        width={32}
        height={32}
        style={{ objectFit: "contain" }}
      />
    ),
    { ...size }
  );
}
