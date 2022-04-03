import { Story } from "@storybook/react";
import { ToolBar, Icon, ToolButton, ToolSeparator, ToolTab } from "../";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Compositions/Layers",
  argTypes: {
    children: { control: false, table: false },
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: Story = () => (
  <div>
    <ToolBar>
      <ToolTab icon={<Icon>🧬</Icon>} label={"Layers"} active={true} />
      <ToolTab icon={<Icon>🤷🏼</Icon>} label={"Composition"} active={false} />
      <ToolTab icon={<Icon>🏃</Icon>} label={"Animation"} active={false} />
      <ToolSeparator />

      <ToolButton active={true} icon={<Icon>✋</Icon>} tooltip="Move mode" />
      <ToolButton icon={<Icon>🔧</Icon>} tooltip="Adjust point mode" />
      <ToolButton icon={<Icon>✏️</Icon>} tooltip="Add point mode" />
      <ToolSeparator />
      <ToolButton
        icon={<Icon>🗑</Icon>}
        disabled={true}
        tooltip="Remove selected point"
      />
      <ToolSeparator />
      <ToolButton icon={"-"} tooltip="Decrease grid size" />
      <ToolTab
        icon={<Icon>📏</Icon>}
        label={"32"}
        tooltip="Toggle grid visibility"
      />
      <ToolButton icon={"+"} tooltip="Increase grid size" />
      <ToolButton icon={<Icon>🧲</Icon>} tooltip="Toggle magnetic grid" />
    </ToolBar>
  </div>
);

export const Layers = Template.bind({});
