interface Props {
  name: string;
  description: string;
  startDate: string; // ISO format: 2026-03-07T08:00:00+07:00
  endDate?: string;
  locationName: string;
  locationAddress: string;
  image: string;
  url: string;
}

export default function EventJsonLd({
  name,
  description,
  startDate,
  endDate,
  locationName,
  locationAddress,
  image,
  url,
}: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    startDate,
    endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode:
      "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: locationName,
      address: {
        "@type": "PostalAddress",
        streetAddress: locationAddress,
        addressCountry: "ID",
      },
    },
    image: [image],
    organizer: {
      "@type": "Organization",
      name: "Nama Yayasan Kamu",
      url: "https://domainkamu.com",
    },
    offers: {
      "@type": "Offer",
      url,
      availability: "https://schema.org/InStock",
      price: "0",
      priceCurrency: "IDR",
      validFrom: startDate,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}