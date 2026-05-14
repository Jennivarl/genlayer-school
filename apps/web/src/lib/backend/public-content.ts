import type { CommunitySpotlight, RegionalTrack, WeeklySummary } from "@genlayer-school/content";
import { communitySpotlights, regionalTracks, weeklySummaries } from "@genlayer-school/content";
import { listAdminContentEntries } from "./content-store";

function mergeBySlug<T extends { slug: string }>(seedItems: T[], publishedItems: T[]): T[] {
  const bySlug = new Map(seedItems.map((item) => [item.slug, item]));

  for (const item of publishedItems) {
    bySlug.set(item.slug, item);
  }

  const publishedSlugs = new Set(publishedItems.map((item) => item.slug));
  return [
    ...publishedItems,
    ...seedItems.filter((item) => !publishedSlugs.has(item.slug)),
  ].map((item) => bySlug.get(item.slug) ?? item);
}

export async function getPublishedWeeklySummaries(): Promise<WeeklySummary[]> {
  const entries = await listAdminContentEntries();
  const published = entries
    .filter((entry) => entry.kind === "weekly" && entry.status === "published")
    .map((entry) => entry.payload as WeeklySummary);

  return mergeBySlug(weeklySummaries, published);
}

export async function getPublishedWeeklySummary(slug: string): Promise<WeeklySummary | null> {
  const summaries = await getPublishedWeeklySummaries();
  return summaries.find((summary) => summary.slug === slug) ?? null;
}

export async function getPublishedCommunitySpotlights(): Promise<CommunitySpotlight[]> {
  const entries = await listAdminContentEntries();
  const published = entries
    .filter((entry) => entry.kind === "spotlight" && entry.status === "published")
    .map((entry) => entry.payload as CommunitySpotlight);

  return mergeBySlug(communitySpotlights, published);
}

export async function getPublishedCommunitySpotlight(slug: string): Promise<CommunitySpotlight | null> {
  const spotlights = await getPublishedCommunitySpotlights();
  return spotlights.find((spotlight) => spotlight.slug === slug) ?? null;
}

export async function getPublishedRegionalTracks(): Promise<RegionalTrack[]> {
  const entries = await listAdminContentEntries();
  const published = entries
    .filter((entry) => entry.kind === "regional" && entry.status === "published")
    .map((entry) => entry.payload as RegionalTrack);

  return mergeBySlug(regionalTracks, published);
}

export async function getPublishedRegionalTrack(slug: string): Promise<RegionalTrack | null> {
  const tracks = await getPublishedRegionalTracks();
  return tracks.find((track) => track.slug === slug) ?? null;
}
