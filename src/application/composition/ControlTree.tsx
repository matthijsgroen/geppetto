import { GeppettoImage } from "../../animation/file2/types";
import { Icon, Panel, Title, ToolBar, ToolButton } from "../../ui-components";
import { UpdateState } from "../types";

type ControlTreeProps = {
  file: GeppettoImage;
  setFile: UpdateState<GeppettoImage>;
};

export const ControlTree: React.FC<ControlTreeProps> = ({ file }) => {
  return (
    <>
      <Title>Controls</Title>
      <ToolBar size="small">
        <ToolButton icon={<Icon>⚙️</Icon>} label={"+"} />
      </ToolBar>
      <Panel padding={5} center>
        <p>Controls here</p>
      </Panel>
    </>
  );
};
