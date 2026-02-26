import { Section } from "@/services/page.service";
import HeroSection from "./sections/layouts/HeroSection";
import CenteredSection from "./sections/layouts/CenteredSection";
import GridSection from "./sections/layouts/GridSection";
import ImageSection from "./sections/layouts/ImageSection";
import TextOnlySection from "./sections/layouts/TextOnlySection";
import StatsSection from "./sections/layouts/StatsSection";

interface Props {
  section: Section;
}

export default function SectionRenderer({ section }: Props) {
  switch (section.layout) {
    case "hero-centered":
      return <HeroSection section={section} />;

    case "grid":
      return <GridSection section={section} />;
    
    case "stats":
      return <StatsSection section={section} />;  

    case "image-left":
    case "image-right":
      return <ImageSection section={section} />;

    case "text-only":
      return <TextOnlySection section={section} />;

    case "centered":
    default:
      return <CenteredSection section={section} />;
  }
}