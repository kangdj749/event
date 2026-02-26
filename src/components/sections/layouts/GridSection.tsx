"use client";

import { Section } from "@/services/page.service";
import clsx from "clsx";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { renderMarkdown } from "@/lib/enterpriseMarkdown";
interface Props {
  section: Section;
}

function toPascalCase(str: string) {
  return str.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("");
}

export default function GridSection({ section }: Props) {
  const bgClass =
    section.background === "dark"
      ? "bg-neutral-950 text-white"
      : section.background === "soft"
      ? "bg-neutral-50 text-foreground"
      : "bg-white text-foreground";

  return (
    <section className={clsx("section-spacing", bgClass)}>
      <div className="container-premium">

        {section.title && (
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <h2 className="heading-2 text-2xl md:text-4xl font-semibold tracking-tight">
              {section.title}
            </h2>
            {section.subtitle && (
              <p className="text-muted text-base md:text-lg leading-snug">
                {section.subtitle}
              </p>
            )}
          </div>
        )}

        {section.features && section.features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {section.features.map((feature, index) => {
              const iconName = feature.icon ? toPascalCase(feature.icon) : null;
              const Icon = (iconName && (Icons as any)[iconName]) || Icons.Sparkles;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="group card-premium border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition">
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    <h3 className="font-semibold text-base leading-snug">{feature.title}</h3>
                  </div>

                  {feature.description && (
                    <div className="space-y-1">
                      {renderMarkdown(feature.description)}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}