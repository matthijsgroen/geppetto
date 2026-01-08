import type { AppSection } from "@/dtos/application.dto";
import { Icon, ToolTab } from "@/ui/components";

type SectionSelectorProps = {
  onSectionChange?: (newSection: AppSection) => void;
  activeSection: AppSection;
};

export const SectionSelector: React.FC<SectionSelectorProps> = ({
  onSectionChange,
  activeSection,
}) => {
  return (
    <>
      <ToolTab
        active={activeSection === "layers"}
        icon={<Icon>🧬</Icon>}
        label="Layers"
        onClick={() => onSectionChange?.("layers")}
      />
      <ToolTab
        active={activeSection === "composition"}
        icon={<Icon>🤷🏼</Icon>}
        label="Composition"
        onClick={() => onSectionChange?.("composition")}
      />
      <ToolTab
        active={activeSection === "animation"}
        icon={<Icon>🏃</Icon>}
        label="Animation"
        onClick={() => onSectionChange?.("animation")}
      />
    </>
  );
};
