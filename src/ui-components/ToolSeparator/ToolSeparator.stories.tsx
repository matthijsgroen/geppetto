import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ToolBar } from "../ToolBar/ToolBar";
import { Icon } from "../Icon/Icon";
import { ToolButton } from "../ToolButton/ToolButton";
import { ToolSeparator } from "./ToolSeparator";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/ToolSeparator",
  component: ToolSeparator,
} as ComponentMeta<typeof ToolBar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ToolBar> = () => (
  <ToolBar>
    <ToolButton icon={<Icon>💡</Icon>} />
    <ToolSeparator />
    <ToolButton icon={<Icon>🚨</Icon>} />
  </ToolBar>
);

export const Default = Template.bind({});
