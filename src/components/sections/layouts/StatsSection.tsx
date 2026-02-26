"use client";

import { Section } from "@/services/page.service";
import clsx from "clsx";
import { motion } from "framer-motion";

interface Props {
  section: Section;
}

export default function StatsSection({ section }: Props) {
  const stats = section.stats ?? []; // ✅ safe fallback

  const bgClass =
    section.background === "dark"
      ? "bg-neutral-950 text-white"
      : section.background === "soft"
      ? "bg-neutral-50 text-foreground"
      : "bg-white text-foreground";

  return (
    <section className={clsx("section-spacing", bgClass)}>
      <div className="container-premium">

        {/* Title */}
        {section.title && (
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <h2 className="heading-2 text-2xl md:text-4xl font-semibold tracking-tight leading-[1.15]">
              {section.title}
            </h2>
            {section.subtitle && (
              <p className="text-sm md:text-base text-muted leading-snug">
                {section.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Stats */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">

            {stats.map((stat, index) => {
              const isLast = index === stats.length - 1;

              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className={clsx(
                    "relative text-center py-6 px-4",
                    !isLast && "border-b border-border",
                    !isLast && "md:border-b-0 md:border-r md:border-border"
                  )}
                >
                  {/* Value */}
                  <div className="text-3xl md:text-4xl font-semibold tracking-tight">
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="mt-1 text-xs md:text-sm text-muted leading-snug">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}

          </div>
        )}
      </div>
    </section>
  );
}