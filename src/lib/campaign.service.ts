import { fetchSheet, RANGE } from "./google-sheet";
import { setCache, getCache } from "./utils/cache";

/* =========================
   TYPES
========================= */

type RawCampaign = Record<string, string>;
type RawStory = Record<string, string>;

export type CampaignSectionType =
  | "heading"
  | "subheading"
  | "text"
  | "image"
  | "quote"
  | "list"
  | "video"
  | "highlight_box"
  | "divider"
  | "stats"
  | "card_grid"
  | "cta";

export type Campaign = {
  id: string;
  slug: string;
  title: string;
  short_tagline: string;
  category: string;
  hero_image_public_id: string;
  hero_video_url?: string;
  goal_amount: number;
  collected_amount: number;
  status: string;
  seo_title?: string;
  seo_description?: string;
  stories: CampaignStorySection[];
};

export type CampaignStorySection = {
  id: string;
  campaign_id: string;
  type: CampaignSectionType;
  content?: string;
  image_id?: string;
  video_url?: string;
  section_order: number;
};

/* =========================
   HELPERS
========================= */

function toNumber(value: unknown): number {
  if (!value) return 0;
  const str = String(value).replace(/[^\d]/g, "");
  const num = Number(str);
  return Number.isNaN(num) ? 0 : num;
}

/* =========================
   NORMALIZERS
========================= */

function normalizeCampaign(raw: RawCampaign): Campaign {
  return {
    id: String(raw.id).trim(),
    slug: String(raw.slug).trim(),
    title: String(raw.title ?? "").trim(),
    short_tagline: String(raw.short_tagline ?? "").trim(),
    category: String(raw.category ?? "").trim().toLowerCase(),
    hero_image_public_id: String(raw.hero_image_public_id ?? "").trim(),
    hero_video_url: raw.hero_video_url
      ? String(raw.hero_video_url).trim()
      : undefined,
    goal_amount: toNumber(raw.goal_amount),
    collected_amount: toNumber(raw.collected_amount),
    status: String(raw.status ?? "").trim(),
    seo_title: raw.seo_title
      ? String(raw.seo_title).trim()
      : undefined,
    seo_description: raw.seo_description
      ? String(raw.seo_description).trim()
      : undefined,
    stories: [],
  };
}

function normalizeStories(
  campaignId: string,
  stories: RawStory[]
): CampaignStorySection[] {
  const allowedTypes: CampaignSectionType[] = [
    "heading",
    "subheading",
    "text",
    "image",
    "quote",
    "list",
    "video",
    "highlight_box",
    "divider",
    "stats",
    "card_grid",
    "cta",
  ];

  return stories
    .filter(
      (s) => String(s.campaign_id).trim() === campaignId
    )
    .map((s) => {
      const rawType = String(s.type ?? "")
        .trim()
        .toLowerCase();

      const safeType: CampaignSectionType =
        allowedTypes.includes(rawType as CampaignSectionType)
          ? (rawType as CampaignSectionType)
          : "text";

      return {
        id: String(s.id ?? "").trim(),
        campaign_id: String(s.campaign_id ?? "").trim(),
        type: safeType,
        content: s.content ? String(s.content).trim() : undefined,
        image_id: s.image_id ? String(s.image_id).trim() : undefined,
        video_url: s.video_url
          ? String(s.video_url).trim()
          : undefined,
        section_order: Number(s.section_order ?? 0),
      };
    })
    .sort((a, b) => a.section_order - b.section_order);
}

/* =========================
   MAIN SERVICE
========================= */

export async function getCampaignBySlug(
  slug: string,
  preview = false
): Promise<Campaign | null> {

  const cacheKey = `campaign:${slug}`;

  if (!preview) {
    const cached = getCache<Campaign>(cacheKey);
    if (cached) return cached;
  }

  const [campaignRows, storyRows] = await Promise.all([
    fetchSheet<RawCampaign>(RANGE.CAMPAIGNS),
    fetchSheet<RawStory>(RANGE.CAMPAIGN_STORY),
  ]);

  const rawCampaign = campaignRows.find(
    (c) =>
      String(c.slug).trim() === slug &&
      String(c.status).trim().toLowerCase() === "active"
  );

  if (!rawCampaign) return null;

  const campaign = normalizeCampaign(rawCampaign);

  campaign.stories = normalizeStories(
    campaign.id,
    storyRows
  );

  if (!preview) {
    setCache(cacheKey, campaign);
  }

  return campaign;
}
