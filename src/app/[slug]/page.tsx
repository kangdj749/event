import { getPageBySlug } from "@/services/page.service";
import { getEventByPageId } from "@/services/event.service";
import SectionRenderer from "@/components/SectionRenderer";
import EventJsonLd from "@/components/seo/EventJsonLd";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 300;

interface Props {
  params: {
    slug: string;
  };
}

async function getData(slug: string) {
  const page = await getPageBySlug(slug);
  if (!page) return null;

  const event = await getEventByPageId(page.id);
  return { page, event };
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const data = await getData(params.slug);

  if (!data) {
    return {
      title: "Halaman Tidak Ditemukan | Graha Dhuafa",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { page, event } = data;

  const baseUrl = "https://grahadhuafa.org";
  const url = `${baseUrl}/${page.slug}`;

  const title =
    page.seo.meta_title || `${page.title} | Graha Dhuafa`;

  const description =
    page.seo.meta_description ||
    "Event resmi Graha Dhuafa.";

  const ogImage =
    event?.jsonld_image ||
    `${baseUrl}/default-og.jpg`;

  return {
    metadataBase: new URL(baseUrl),

    title,
    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      siteName: "Graha Dhuafa",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
        },
      ],
      locale: "id_ID",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Page({ params }: Props) {
  const data = await getData(params.slug);

  if (!data) notFound();

  const { page, event } = data;

  const url = `https://grahadhuafa.org/${page.slug}`;

  return (
    <>
      {event && (
        <EventJsonLd
          name={page.title}
          description={
            page.seo.meta_description ||
            "Event resmi Graha Dhuafa"
          }
          startDate={event.start_date}
          endDate={event.end_date}
          locationName={event.location_name}
          locationAddress={event.location_address}
          image={event.jsonld_image}
          url={url}
        />
      )}

      {page.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  );
}