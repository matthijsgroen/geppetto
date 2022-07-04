import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ToolBar } from "../ToolBar/ToolBar";
import { Icon } from "../Icon/Icon";
import { ToolButton } from "../ToolButton/ToolButton";
import { ToolSpacer as ToolSpacerComponent } from "./ToolSpacer";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/ToolSpacer",
  component: ToolSpacerComponent,
} as ComponentMeta<typeof ToolSpacerComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ToolSpacerComponent> = () => (
  <div style={{ width: "100%" }}>
    <ToolBar>
      <ToolButton icon={<Icon>💡</Icon>} />
      <ToolSpacerComponent />
      <ToolButton icon={<Icon>🚨</Icon>} />
    </ToolBar>
  </div>
);

export const ToolSpacer = Template.bind({});
