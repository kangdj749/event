import { fetchSheet, RANGE } from "./google-sheet";

/* ===============================
   BASE SHEET ROW TYPE
================================ */

type SheetRow = Record<string, string | undefined>;

/* ===============================
   TYPES
================================ */

interface Update extends SheetRow {
  id: string;
  campaign_id: string;
  title: string;
  content: string;
  created_at: string;
}

interface Prayer extends SheetRow {
  id: string;
  campaign_id: string;
  message: string;
  created_at: string;
}

interface Disbursement extends SheetRow {
  id: string;
  campaign_id: string;
  amount: string;
  description: string;
  date: string;
}

interface DonationRow extends SheetRow {
  id: string;
  campaign_id: string;
  donor_name: string;
  amount: string;
  payment_status: string;
  message?: string;
  created_at: string;
}

/* ===============================
   HELPERS
================================ */

function toNumber(value?: string): number {
  if (!value) return 0;
  const clean = value.replace(/[^\d]/g, "");
  const num = Number(clean);
  return Number.isNaN(num) ? 0 : num;
}

/* ===============================
   DONORS
================================ */

export async function getRecentDonors(
  campaignId: string
) {
  const data = await fetchSheet<DonationRow>(
    RANGE.DONATIONS
  );

  return data
    .filter(
      (d) =>
        String(d.campaign_id).trim() === campaignId &&
        String(d.payment_status).trim().toLowerCase() === "paid"
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 5)
    .map((d) => ({
      id: String(d.id).trim(),
      name: d.donor_name?.trim() || "Hamba Allah",
      amount: toNumber(d.amount),
      created_at: d.created_at,
    }));
}

/* ===============================
   UPDATES
================================ */

export async function getRecentUpdates(
  campaignId: string
) {
  const data = await fetchSheet<Update>(
    RANGE.UPDATES
  );

  return data
    .filter(
      (u) => String(u.campaign_id).trim() === campaignId
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 5);
}

/* ===============================
   PRAYERS
================================ */

export async function getRecentPrayers(
  campaignId: string
) {
  const data = await fetchSheet<Prayer>(
    RANGE.PRAYERS
  );

  return data
    .filter(
      (p) => String(p.campaign_id).trim() === campaignId
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 5);
}

/* ===============================
   DISBURSEMENTS
================================ */

export async function getRecentDisbursements(
  campaignId: string
) {
  const data = await fetchSheet<Disbursement>(
    RANGE.DISBURSEMENTS
  );

  return data
    .filter(
      (d) => String(d.campaign_id).trim() === campaignId
    )
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, 5)
    .map((d) => ({
      ...d,
      amount: toNumber(d.amount),
    }));
}

/* ===============================
   TRUST STATS
================================ */

export async function getCampaignTrustStats(
  campaignId: string
) {
  const data = await fetchSheet<DonationRow>(
    RANGE.DONATIONS
  );

  const paid = data.filter(
    (d) =>
      String(d.campaign_id).trim() === campaignId &&
      String(d.payment_status).trim().toLowerCase() === "paid"
  );

  const totalDonors = paid.length;

  const totalAmount = paid.reduce(
    (sum, d) => sum + toNumber(d.amount),
    0
  );

  return {
    totalDonors,
    totalAmount,
  };
}
