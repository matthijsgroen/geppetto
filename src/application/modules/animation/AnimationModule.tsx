import { StartupScreen } from "@/application/modules/application-menu/ui/Startup";
import { useFile } from "@/application/state/FileContext";
import { SectionSelector } from "@/application/ui/SectionSelector";
import type { AppSection } from "@/dtos/application.dto";
import { Column, Panel, ToolBar, ToolSeparator } from "@/ui/components";

type AnimationModuleProps = {
  onSectionChange?: (newSection: AppSection) => void;
  menu?: React.ReactNode;
  texture: HTMLImageElement | null;
};

export const AnimationModule: React.FC<AnimationModuleProps> = ({
  menu,
  texture,
  onSectionChange,
}) => {
  const [file, setFile] = useFile();
  return (
    <Column>
      <ToolBar>
        {menu}
        <ToolSeparator />
        <SectionSelector
          activeSection="animation"
          onSectionChange={onSectionChange}
        />
      </ToolBar>
      <Panel center workspace>
        <StartupScreen file={file} screen="animation" texture={texture} />
      </Panel>
    </Column>
  );
};
