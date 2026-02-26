"use client";

import Image from "next/image";
import { Section } from "@/services/page.service";
import Button from "../Button";
import clsx from "clsx";
import { cloudinaryImage } from "@/lib/cloudinary1";
import { motion } from "framer-motion";
import { renderMarkdown } from "@/lib/enterpriseMarkdown";

interface Props {
  section: Section;
}

export default function ImageSection({ section }: Props) {
  const reverse = section.layout === "image-right" ? "lg:flex-row-reverse" : "";

  const bgClass =
    section.background === "dark"
      ? "bg-neutral-950 text-white"
      : section.background === "soft"
      ? "bg-neutral-50 text-foreground"
      : "bg-white text-foreground";

  const hasImage = !!section.image_url;

  return (
    <section className={clsx("section-spacing", bgClass)}>
      <div className={clsx("container-premium flex flex-col lg:flex-row items-center gap-8 lg:gap-12", reverse)}>

        {/* IMAGE */}
        {hasImage && (
          <motion.div
            className="relative w-full lg:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden group shadow-xl">
              <Image
                src={cloudinaryImage(section.image_url!, "card")}
                alt={section.title || "Image"}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-40" />
            </div>
          </motion.div>
        )}

        {/* CONTENT */}
        <motion.div
          className="w-full lg:w-1/2 max-w-xl space-y-4 text-center lg:text-left"
          initial={{ opacity: 0, x: reverse ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {section.badge && (
            <div className="inline-flex items-center px-4 py-1.5 text-[11px] md:text-xs rounded-full bg-primary/10 text-primary font-semibold tracking-wider uppercase">
              {section.badge}
            </div>
          )}

          {section.title && (
            <h2 className="heading-2 text-2xl md:text-4xl font-semibold tracking-tight leading-[1.15]">
              {section.title}
            </h2>
          )}

          {section.subtitle && (
            <p className="text-sm md:text-base text-muted leading-snug">
              {section.subtitle}
            </p>
          )}

          {section.content && (
            <div className="space-y-2">
              {renderMarkdown(section.content)}
            </div>
          )}

          {section.closing && (
            <div className="mt-2 text-base md:text-lg font-semibold tracking-tight">
              {renderMarkdown(section.closing)}
            </div>
          )}

          {(section.cta_label || section.secondary_cta_label) && (
            <div className="pt-4 flex flex-wrap gap-3 justify-center lg:justify-start">
              {section.cta_label && section.cta_url && (
                <Button href={section.cta_url} className="px-6 py-2.5 text-sm rounded-xl shadow-md hover:shadow-lg">
                  {section.cta_label}
                </Button>
              )}
              {section.secondary_cta_label && section.secondary_cta_url && (
                <Button href={section.secondary_cta_url} variant="outline" className="px-6 py-2.5 text-sm rounded-xl">
                  {section.secondary_cta_label}
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}