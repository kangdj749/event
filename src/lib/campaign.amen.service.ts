import { fetchSheet, RANGE } from "./google-sheet";
import { getSheetsClient } from "./google-sheet-client";

interface PrayerRow {
  [key: string]: unknown; // ← WAJIB untuk satisfy Record constraint
  id: string;
  campaign_id: string;
  name: string;
  message: string;
  created_at: string;
  amen_count?: string | number;
}


export async function incrementPrayerAmen(
  prayerId: string
): Promise<number> {
  const sheets = getSheetsClient();

  const prayers = await fetchSheet<PrayerRow>(
    RANGE.PRAYERS
  );

  const index = prayers.findIndex(
    (p) => p.id === prayerId
  );

  if (index === -1) return 0;

  const rowNumber = index + 2;
  const current = Number(prayers[index].amen_count || 0);
  const updated = current + 1;

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `prayers!F${rowNumber}`, // kolom amen_count
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[updated]],
    },
  });

  return updated;
}