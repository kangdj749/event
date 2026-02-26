import { getSheetsClient } from "./google-sheet-client";

const SHEET_ID = process.env.GOOGLE_SHEET_ID_LP!;

/* ======================================================
   MEMORY CACHE SYSTEM (ANTI QUOTA BOMB)
====================================================== */

type CacheEntry = {
  data: any;
  timestamp: number;
};

const memoryCache: Record<string, CacheEntry> = {};

const CACHE_TTL = 1000 * 60 * 5; // 5 menit

/* ======================================================
   RANGE MAP
====================================================== */

export const RANGE = {
  PAGES: "PAGES!A:F",
  SECTIONS: "SECTIONS!A:P",
  FEATURES: "FEATURES!A:F",
  HERO: "HERO!A:O",
  SECTION_STATS: "SECTION_STATS!A:E",
  EVENTS: "EVENTS!A:G",
};

/* ======================================================
   GENERIC FETCH WITH CACHE + RETRY
====================================================== */

export async function fetchSheet<T extends Record<string, unknown>>(
  range: string
): Promise<T[]> {
  const now = Date.now();

  /* ================= CACHE CHECK ================= */

  const cached = memoryCache[range];

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data as T[];
  }

  /* ================= FETCH FROM GOOGLE ================= */

  try {
    const sheets = getSheetsClient();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });

    const rows = res.data.values ?? [];

    if (rows.length === 0) {
      memoryCache[range] = {
        data: [],
        timestamp: now,
      };
      return [];
    }

    const [headerRow, ...dataRows] = rows;

    const headers = headerRow.map((h) => String(h));

    const mapped = dataRows.map((row) => {
      const obj: Record<string, unknown> = {};

      headers.forEach((key, i) => {
        obj[key] = row[i] ?? "";
      });

      return obj as T;
    });

    /* ================= SAVE TO CACHE ================= */

    memoryCache[range] = {
      data: mapped,
      timestamp: now,
    };

    return mapped;
  } catch (error: any) {
    /* ================= RATE LIMIT SAFETY ================= */

    if (error?.code === 429) {
      console.warn("⚠️ Google Sheets rate limit hit. Returning stale cache if exists.");

      if (cached) {
        return cached.data as T[];
      }
    }

    console.error("Google Sheets Fetch Error:", error);
    throw error;
  }
}

/* ======================================================
   MANUAL CACHE CLEAR (OPTIONAL)
====================================================== */

export function clearSheetCache() {
  Object.keys(memoryCache).forEach((key) => {
    delete memoryCache[key];
  });
}