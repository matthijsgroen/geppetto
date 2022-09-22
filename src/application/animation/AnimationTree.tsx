import { isEmpty } from "../../animation/file2/hierarchy";
import {
  EmptyTree,
  Icon,
  Paragraph,
  ToolBar,
  ToolButton,
  ToolSeparator,
  Tree,
} from "../../ui-components";
import { useFile } from "../contexts/FileContext";
import { AnimationTreeEnvironment } from "../treeEnvironments/AnimationTreeEnvironment";
import { AppSection, UseState } from "../types";

type AnimationTreeProps = {
  selectedAnimationsState: UseState<string[]>;
  onSectionChange?: (newSection: AppSection) => void;
};

export const AnimationTree: React.FC<AnimationTreeProps> = ({
  selectedAnimationsState,
  onSectionChange,
}) => {
  const [selectedAnimations] = selectedAnimationsState;
  const [file] = useFile();

  return (
    <AnimationTreeEnvironment
      selectedItemsState={selectedAnimationsState}
      treeId="animation"
    >
      <ToolBar size="small">
        <ToolButton
          icon={<Icon>️🎞</Icon>}
          tooltip={"Add animation track"}
          label={"+"}
          disabled
        />
        <ToolSeparator />
        <ToolButton
          icon={<Icon>🗑</Icon>}
          tooltip={"Remove animation track"}
          disabled={selectedAnimations.length !== 1}
        />
      </ToolBar>
      {isEmpty(file.layerHierarchy) ? (
        <EmptyTree>
          <Paragraph>
            Start by adding a layer on the
            <ToolButton
              size="small"
              icon={<Icon>🧬</Icon>}
              label="Layers screen"
              tooltip="Go to layers screen"
              shadow
              onClick={() => onSectionChange && onSectionChange("layers")}
            />
            .
          </Paragraph>
        </EmptyTree>
      ) : (
        <Tree treeId="animation" />
      )}
    </AnimationTreeEnvironment>
  );
};
