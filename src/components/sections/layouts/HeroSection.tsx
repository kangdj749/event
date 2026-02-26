"use client";

import Image from "next/image";
import { Section } from "@/services/page.service";
import { cloudinaryImage } from "@/lib/cloudinary1";
import Button from "../Button";

interface Props {
  section: Section;
}

export default function HeroSection({ section }: Props) {
  const contentLines =
    section.content?.split("\n").filter(Boolean) ?? [];

  const heroImage = cloudinaryImage(
    section.background_image ?? "",
    "lcp"
  );

  return (
    <section className="relative min-h-[85vh] flex items-center text-white overflow-hidden bg-neutral-900">

      {/* Background Image */}
      {heroImage && (
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          unoptimized
        />
      )}

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container-premium text-center space-y-6">

          {section.badge && (
            <div className="inline-block px-4 py-1 text-xs tracking-wide uppercase rounded-full bg-white/10 backdrop-blur-sm">
              {section.badge}
            </div>
          )}

          {section.title && (
            <h1 className="heading-hero text-balance">
              {section.title}
            </h1>
          )}

          {section.subtitle && (
            <h2 className="heading-2 text-neutral-200 max-w-2xl mx-auto">
              {section.subtitle}
            </h2>
          )}

          {section.intro && (
            <p className="text-base text-neutral-200 max-w-2xl mx-auto">
              {section.intro}
            </p>
          )}

          {contentLines.length > 0 && (
            <div className="space-y-3 max-w-2xl mx-auto">
              {contentLines.map((line: string, i: number) => (
                <p key={i} className="text-neutral-100">
                  {line}
                </p>
              ))}
            </div>
          )}

          {(section.cta_label || section.secondary_cta_label) && (
            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">

              {section.cta_label && section.cta_url && (
                <Button href={section.cta_url}>
                  {section.cta_label}
                </Button>
              )}

              {section.secondary_cta_label &&
                section.secondary_cta_url && (
                  <a
                    href={section.secondary_cta_url}
                    className="px-6 py-3 rounded-lg border border-white/40 hover:bg-white/10 transition"
                  >
                    {section.secondary_cta_label}
                  </a>
                )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}