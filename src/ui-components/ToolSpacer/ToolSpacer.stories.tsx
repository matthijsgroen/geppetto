import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ToolBar } from "../ToolBar/ToolBar";
import { Icon } from "../Icon/Icon";
import { ToolButton } from "../ToolButton/ToolButton";
import { ToolSpacer } from "./ToolSpacer";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/ToolSpacer",
  component: ToolSpacer,
} as ComponentMeta<typeof ToolSpacer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ToolSpacer> = () => (
  <ToolBar>
    <ToolButton icon={<Icon>💡</Icon>} />
    <ToolSpacer />
    <ToolButton icon={<Icon>🚨</Icon>} />
  </ToolBar>
);

export const Default = Template.bind({});
