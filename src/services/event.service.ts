import { fetchSheet } from "@/lib/google-sheet-lp";

export interface Event {
  id: string;
  page_id: string;
  start_date: string;
  end_date: string;
  location_name: string;
  location_address: string;
  jsonld_image: string;
}

/**
 * Utility safe string
 */
function safe(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
}

export async function getEventByPageId(
  pageId: string
): Promise<Event | null> {
  const rows = (await fetchSheet("EVENTS")) as Record<string, unknown>[];

  const raw = rows.find((row) => safe(row.page_id) === pageId);

  if (!raw) return null;

  return {
    id: safe(raw.id),
    page_id: safe(raw.page_id),
    start_date: safe(raw.start_date),
    end_date: safe(raw.end_date),
    location_name: safe(raw.location_name),
    location_address: safe(raw.location_address),
    jsonld_image: safe(raw.jsonld_image),
  };
}