import Image from "next/image";
import { cloudinaryImage } from "@/lib/cloudinary1";
import { SectionBackground } from "@/services/page.service";

interface Props {
  children: React.ReactNode;
  background?: SectionBackground;
  backgroundImage?: string;
  overlayOpacity?: number;
}

export default function SectionContainer({
  children,
  background = "white",
  backgroundImage,
  overlayOpacity = 0,
}: Props) {
  const bgClass =
    background === "dark"
      ? "bg-neutral-900 text-white"
      : background === "soft"
      ? "bg-neutral-50"
      : "bg-white";

  return (
    <section className={`relative py-20 ${bgClass}`}>
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={cloudinaryImage(backgroundImage, "lcp")}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          {overlayOpacity > 0 && (
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity / 100 }}
            />
          )}
        </div>
      )}

      <div className="relative max-w-6xl mx-auto px-6">
        {children}
      </div>
    </section>
  );
}