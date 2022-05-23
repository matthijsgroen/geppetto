import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ToolBar } from "../ToolBar/ToolBar";
import { Icon } from "../Icon/Icon";
import { ToolButton } from "../ToolButton/ToolButton";
import { ToolSeparator as ToolSeparatorComponent } from "./ToolSeparator";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/ToolSeparator",
  component: ToolSeparatorComponent,
} as ComponentMeta<typeof ToolSeparatorComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ToolSeparatorComponent> = () => (
  <ToolBar>
    <ToolButton icon={<Icon>💡</Icon>} />
    <ToolSeparatorComponent />
    <ToolButton icon={<Icon>🚨</Icon>} />
  </ToolBar>
);

export const ToolSeparator = Template.bind({});
