import { stat } from "node:fs/promises";
import { join, sep } from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/backend/admin-auth";
import { getPublishedRegionalTracks } from "@/lib/backend/public-content";

function getCertificatesDirectory() {
  const cwd = process.cwd();
  const publicRoot = cwd.endsWith(`${sep}apps${sep}web`) ? join(cwd, "public") : join(cwd, "apps", "web", "public");
  return join(publicRoot, "certificates");
}

export async function GET(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  const tracks = await getPublishedRegionalTracks();
  const certificatesDirectory = getCertificatesDirectory();

  const templates = await Promise.all(tracks.map(async (track) => {
    const fileName = `${track.slug}.png`;
    const repositoryPath = `apps/web/public/certificates/${fileName}`;
    const filePath = join(certificatesDirectory, fileName);

    try {
      const file = await stat(filePath);
      return {
        regionSlug: track.slug,
        regionName: track.regionName,
        languageName: track.languageName,
        nativeLanguageName: track.nativeLanguageName,
        certificateTitle: track.certificateTitle,
        fileName,
        repositoryPath,
        publicUrl: `/certificates/${fileName}`,
        available: file.isFile(),
        sizeBytes: file.size,
        updatedAt: file.mtime.toISOString(),
      };
    } catch {
      return {
        regionSlug: track.slug,
        regionName: track.regionName,
        languageName: track.languageName,
        nativeLanguageName: track.nativeLanguageName,
        certificateTitle: track.certificateTitle,
        fileName,
        repositoryPath,
        publicUrl: `/certificates/${fileName}`,
        available: false,
        sizeBytes: null,
        updatedAt: null,
      };
    }
  }));

  const available = templates.filter((template) => template.available).length;

  return NextResponse.json({
    templates,
    summary: {
      available,
      missing: templates.length - available,
      total: templates.length,
    },
  });
}
