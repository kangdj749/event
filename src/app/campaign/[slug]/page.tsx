import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { getCampaignBySlug } from "@/lib/campaign.service";
import {
  getRecentDonors,
  getRecentUpdates,
  getRecentPrayers,
  getRecentDisbursements,
  getCampaignTrustStats,
} from "@/lib/campaign.extras.service";


import CampaignHero from "@/components/campaign/CampaignHero";
import CampaignProgress from "@/components/campaign/CampaignProgress";
import CampaignStoryRenderer from "@/components/campaign/CampaignStoryRenderer";
import CampaignStorySkeleton from "@/components/campaign/CampaignStorySkeleton";
import AnimatedCounter from "@/components/campaign/AnimatedCounter";
import DonationSection from "./DonationSection";
import PrayerAmenButton from "@/components/PrayerAmenButton";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
  searchParams?: { ref?: string };
}

interface Donor {
  id: string;
  name?: string;
  amount: string | number;
}

interface UpdateItem {
  id: string;
  title: string;
  content: string;
}

interface Prayer {
  id: string;
  message: string;
  amen_count?: string | number;
}

interface Disbursement {
  id: string;
  description: string;
  amount: string | number;
}


export default async function CampaignPage({
  params,
  searchParams,
}: PageProps) {
  /* ===============================
     FETCH CAMPAIGN
  =============================== */

  const campaign = await getCampaignBySlug(params.slug);
  if (!campaign) return notFound();

  /* ===============================
     PARALLEL FETCH (OPTIMAL)
  =============================== */

  const [
    recentDonors,
    recentUpdates,
    recentPrayers,
    recentDisbursements,
    trustStats,
    ] = await Promise.all([
    getRecentDonors(campaign.id) as Promise<Donor[]>,
    getRecentUpdates(campaign.id) as Promise<UpdateItem[]>,
    getRecentPrayers(campaign.id) as Promise<Prayer[]>,
    getRecentDisbursements(campaign.id) as Promise<Disbursement[]>,
    getCampaignTrustStats(campaign.id),
   
  ]);

  /* ===============================
     AFFILIATE SYSTEM
  =============================== */

  const cookieStore = cookies();
  const existingRef = cookieStore.get("campaign_ref")?.value;
  const incomingRef = searchParams?.ref;

  let affiliateCode = existingRef ?? null;

  if (incomingRef && incomingRef !== existingRef) {
    cookieStore.set("campaign_ref", incomingRef, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    affiliateCode = incomingRef;
  }

  /* ===============================
     RENDER
  =============================== */

  return (
    <div className="flex justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white min-h-screen pb-32 shadow-sm">

        {/* HERO */}
        <CampaignHero
          title={campaign.title}
          image={campaign.hero_image_public_id}
          videoUrl={campaign.hero_video_url}
        />

        <div className="p-4 space-y-6">

          {/* TITLE */}
          <div>
            <h1 className="text-xl font-bold leading-snug">
              {campaign.title}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {campaign.short_tagline}
            </p>
          </div>

          {/* PROGRESS */}
          <CampaignProgress
            slug={campaign.slug}
            initialCollected={campaign.collected_amount}
            goal_amount={campaign.goal_amount}
          />

          {/* TRUST BOX */}
          <div className="bg-green-50 p-4 rounded-xl text-sm space-y-2">
            <div className="font-semibold text-green-700">
              💚 {trustStats.totalDonors} orang sudah berdonasi
            </div>

            <div className="text-green-600">
              Total terkumpul:{" "}
              <AnimatedCounter value={trustStats.totalAmount} />
            </div>

           </div>
        </div>

        {/* STORY */}
        <div className="px-4 pb-8">
          {campaign.stories?.length ? (
            <CampaignStoryRenderer sections={campaign.stories} />
          ) : (
            <CampaignStorySkeleton />
          )}
        </div>

        {/* SOCIAL PREVIEW SECTION */}
        <div className="px-4 pt-6 pb-10 border-t mt-8 space-y-8 bg-gray-50 text-sm">

          {/* UPDATES */}
          {recentUpdates.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">📢 Kabar Terbaru</h3>
              <div className="space-y-2">
                {recentUpdates.map((u) => (
                  <div key={u.id} className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="font-medium text-sm">{u.title}</p>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                      {u.content}
                    </p>
                  </div>
                ))}
              </div>
              <a
                href={`/campaign/${campaign.slug}/kabar`}
                className="block mt-2 text-blue-600 text-xs"
              >
                Lihat semua →
              </a>
            </div>
          )}

          {/* DONORS */}
          {recentDonors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">❤️ Donatur Terbaru</h3>
              <div className="space-y-2">
                {recentDonors.map((d) => (
                  <div
                    key={d.id}
                    className="flex justify-between bg-white p-3 rounded-lg shadow-sm"
                  >
                    <span className="text-gray-700 text-sm">
                      {d.name || "Hamba Allah"}
                    </span>
                    <span className="font-semibold text-sm">
                      Rp {Number(d.amount).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
              <a
                href={`/campaign/${campaign.slug}/donatur`}
                className="block mt-2 text-blue-600 text-xs"
              >
                Lihat semua →
              </a>
            </div>
          )}

          {/* PRAYERS */}
          {recentPrayers.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">🤲 Doa Orang Baik</h3>

              <div className="space-y-2">
                {recentPrayers.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white p-3 rounded-lg shadow-sm"
                  >
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {p.message}
                    </p>

                    <PrayerAmenButton
                      prayerId={p.id}
                      initialCount={Number(p.amen_count || 0)}
                    />
                  </div>
                ))}
              </div>

              <a
                href={`/campaign/${campaign.slug}/doa`}
                className="block mt-2 text-blue-600 text-xs"
              >
                Lihat semua →
              </a>
            </div>
          )}


          {/* DISBURSEMENTS */}
          {recentDisbursements.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">💰 Pencairan Dana</h3>
              <div className="space-y-2">
                {recentDisbursements.map((d) => (
                  <div
                    key={d.id}
                    className="flex justify-between bg-white p-3 rounded-lg shadow-sm"
                  >
                    <span className="text-gray-600 text-sm">
                      {d.description}
                    </span>
                    <span className="font-semibold text-sm">
                      Rp {Number(d.amount).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
              <a
                href={`/campaign/${campaign.slug}/pencairan`}
                className="block mt-2 text-blue-600 text-xs"
              >
                Lihat semua →
              </a>
            </div>
          )}
        </div>

        {/* STICKY DONATE CTA */}
        <DonationSection
          campaignId={campaign.id}
          affiliateCode={affiliateCode}
        />

      </div>
    </div>
  );
}
