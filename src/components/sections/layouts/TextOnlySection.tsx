import { Section } from "@/services/page.service";
import SectionContainer from "../SectionContainer";

interface Props {
  section: Section;
}

export default function TextOnlySection({ section }: Props) {
  const body = section.content?.split("\n").filter(Boolean) ?? [];

  return (
    <SectionContainer
      background={section.background}
      backgroundImage={section.background_image}
      overlayOpacity={section.overlay_opacity}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {section.title && (
          <h2 className="text-2xl md:text-3xl font-bold">
            {section.title}
          </h2>
        )}

        {body.map((line, i) => (
          <p key={i} className="text-neutral-600">
            {line}
          </p>
        ))}
      </div>
    </SectionContainer>
  );
}