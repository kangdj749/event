"use client";

import { Section } from "@/services/page.service";
import Button from "../Button";
import clsx from "clsx";
import { renderMarkdown } from "@/lib/enterpriseMarkdown";
interface Props {
  section: Section;
}

export default function CenteredSection({ section }: Props) {
  const bgClass =
    section.background === "dark"
      ? "bg-neutral-950 text-white"
      : section.background === "soft"
      ? "bg-neutral-50 text-foreground"
      : "bg-white text-foreground";

  return (
    <section className={clsx("section-spacing relative overflow-hidden", bgClass)}>
      <div className="container-premium relative z-10 max-w-2xl mx-auto text-center">

        {section.badge && (
          <div className="mb-4 inline-flex items-center px-4 py-1.5 text-[11px] md:text-xs rounded-full bg-primary/10 text-primary font-semibold tracking-wider uppercase">
            {section.badge}
          </div>
        )}

        {section.title && (
          <h2 className="heading-2 font-semibold tracking-tight text-2xl md:text-4xl leading-[1.15]">
            {section.title}
          </h2>
        )}

        {section.subtitle && (
          <p className="mt-3 text-sm md:text-base text-muted leading-snug max-w-xl mx-auto">
            {section.subtitle}
          </p>
        )}

        {section.intro && (
          <p className="mt-4 text-sm md:text-base leading-snug text-muted max-w-xl mx-auto">
            {section.intro}
          </p>
        )}

        {section.content && (
          <div className="mt-6 space-y-1.5">
            {renderMarkdown(section.content)}
          </div>
        )}

        {section.closing && (
          <div className="mt-6 max-w-lg mx-auto">
            <p className="text-base md:text-lg font-semibold leading-[1.35] tracking-tight">
              {section.closing}
            </p>
          </div>
        )}

        {(section.cta_label || section.secondary_cta_label) && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
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
      </div>
    </section>
  );
}