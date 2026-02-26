// ------------------------------------------------------
// PAGE SERVICE — Google Sheet Headless CMS (V4 STABLE)
// Hero + Sections unified structure
// Fully typed, clean, scalable
// ------------------------------------------------------

import { fetchSheet, RANGE } from "@/lib/google-sheet-lp";
import { getCache, setCache } from "@/lib/cache";

/* =========================
   RAW TYPES
========================= */

type RawPage = Record<string, unknown>;
type RawSection = Record<string, unknown>;
type RawFeature = Record<string, unknown>;
type RawStat = Record<string, unknown>;
type RawHero = Record<string, unknown>;

/* =========================
   FINAL TYPES
========================= */

export type SectionBackground = "white" | "soft" | "dark";

export type LayoutVariant =
  | "hero-centered"
  | "centered"
  | "grid"
  | "image-left"
  | "image-right"
  | "stats"
  | "text-only";

export interface Feature {
  id: string;
  section_id: string;
  title: string;
  description?: string;
  icon?: string;
  order: number;
}

export interface Stat {
  id: string;
  section_id: string;
  label: string;
  value: string;
  order: number;
}

export interface Section {
  id: string;
  page_id: string;
  layout: LayoutVariant;
  order: number;

  badge?: string;
  title?: string;
  subtitle?: string;
  meta?: string;
  description?: string;
  intro?: string;
  content?: string;
  closing?: string; 
  cta_label?: string;
  cta_url?: string;
  secondary_cta_label?: string;
  secondary_cta_url?: string;

  background?: SectionBackground;
  background_image?: string;
  overlay_opacity?: number;
  image_url?: string
  features?: Feature[];
  stats?: Stat[];
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  sections: Section[];
  seo: {
    meta_title: string;
    meta_description: string;
  };
}

/* =========================
   HELPERS
========================= */

function safe(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (v == null) return "";
  return String(v).trim();
}

function toNumber(v: unknown): number {
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
}

function normalizeBackground(v?: unknown): SectionBackground {
  const val = safe(v).toLowerCase();
  if (val === "dark") return "dark";
  if (val === "soft") return "soft";
  return "white";
}

function isActive(v: unknown): boolean {
  return ["true", "1", "yes"].includes(safe(v).toLowerCase());
}

/* =========================
   MAIN FUNCTION
========================= */

export async function getPageBySlug(
  slug: string,
  preview = false
): Promise<Page | null> {
  const cacheKey = `page:${slug.toLowerCase()}`;

  if (!preview) {
    const cached = getCache<Page>(cacheKey);
    if (cached) return cached;
  }

  const [
    pageRows,
    sectionRows,
    featureRows,
    statRows,
    heroRows,
  ] = await Promise.all([
    fetchSheet<RawPage>(RANGE.PAGES),
    fetchSheet<RawSection>(RANGE.SECTIONS),
    fetchSheet<RawFeature>(RANGE.FEATURES),
    fetchSheet<RawStat>(RANGE.SECTION_STATS),
    fetchSheet<RawHero>(RANGE.HERO),
  ]);

  /* ================= PAGE ================= */

  const rawPage = pageRows.find(
    (p) =>
      safe(p.slug).toLowerCase() === slug.toLowerCase() &&
      isActive(p.is_active)
  );

  if (!rawPage) return null;

  const pageId = safe(rawPage.id);

  /* ================= HERO ================= */

  const heroRow = heroRows.find(
    (h) => safe(h.page_id) === pageId
  );

  const heroSection: Section | null = heroRow
    ? {
        id: safe(heroRow.id) || "hero",
        page_id: pageId,
        layout: (safe(heroRow.layout) ||
          "hero-centered") as LayoutVariant,
        order: 0,

        badge: safe(heroRow.badge),
        title: safe(heroRow.title),
        subtitle: safe(heroRow.subtitle),
        meta: safe(heroRow.meta),
        description: safe(heroRow.description),
        content: safe(heroRow.content),

        cta_label: safe(heroRow.cta_label),
        cta_url: safe(heroRow.cta_url),
        secondary_cta_label: safe(heroRow.secondary_cta_label),
        secondary_cta_url: safe(heroRow.secondary_cta_url),

        background: normalizeBackground(heroRow.background),
        background_image: safe(heroRow.background_image),
        overlay_opacity: toNumber(heroRow.overlay_opacity),
      }
    : null;

  /* ================= SECTIONS ================= */

    const sections: Section[] = sectionRows
    .filter((s) => safe(s.page_id) === pageId)
    .map((s) => {
        const sectionId = safe(s.id);

        const features: Feature[] = featureRows
        .filter((f) => safe(f.section_id) === sectionId)
        .map((f) => ({
            id: safe(f.id),
            section_id: safe(f.section_id),
            title: safe(f.title),
            description: safe(f.description) || undefined,
            icon: safe(f.icon) || undefined,
            order: toNumber(f.order),
        }))
        .sort((a, b) => a.order - b.order);

        const stats: Stat[] = statRows
        .filter((st) => safe(st.section_id) === sectionId)
        .map((st) => ({
            id: safe(st.id),
            section_id: safe(st.section_id),
            label: safe(st.label),
            value: safe(st.value),
            order: toNumber(st.order),
        }))
        .sort((a, b) => a.order - b.order);

        return {
        id: sectionId,
        page_id: pageId,
        layout: safe(s.layout) as LayoutVariant,
        order: toNumber(s.order),

        badge: safe(s.badge),
        title: safe(s.title),
        subtitle: safe(s.subtitle),
        meta: safe(s.meta),
        description: safe(s.description),
        content: safe(s.content),
        intro: safe(s.intro),
        closing: safe(s.closing),

        cta_label: safe(s.cta_label),
        cta_url: safe(s.cta_url),
        secondary_cta_label: safe(s.secondary_cta_label),
        secondary_cta_url: safe(s.secondary_cta_url),

        background: normalizeBackground(s.background),
        background_image: safe(s.background_image),
        overlay_opacity: toNumber(s.overlay_opacity),

        image_url: safe(s.image_url), // ✅ pastikan ini masuk

        features: features.length ? features : undefined,
        stats: stats.length ? stats : undefined,
        };
    })
    .sort((a, b) => a.order - b.order);

  const finalSections = heroSection
    ? [heroSection, ...sections]
    : sections;

  const page: Page = {
    id: pageId,
    slug: safe(rawPage.slug),
    title: safe(rawPage.title),
    sections: finalSections,
    seo: {
      meta_title: safe(rawPage.seo_title),
      meta_description: safe(rawPage.seo_description),
    },
  };

  if (!preview) setCache(cacheKey, page);

  return page;
}

/* =========================
   GET ALL PAGES (FOR SITEMAP)
========================= */

export async function getAllPages(): Promise<
  { slug: string; updated_at?: string }[]
> {
  const pageRows = await fetchSheet<RawPage>(RANGE.PAGES);

  return pageRows
    .filter((p) => isActive(p.is_active))
    .map((p) => ({
      slug: safe(p.slug),
      updated_at: safe(p.updated_at) || undefined,
    }));
}