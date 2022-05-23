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
  <ToolBar>
    <ToolButton icon={<Icon>💡</Icon>} />
    <ToolSpacerComponent />
    <ToolButton icon={<Icon>🚨</Icon>} />
  </ToolBar>
);

export const ToolSpacer = Template.bind({});
