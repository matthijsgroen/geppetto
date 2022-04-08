import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ToolBar } from "./ToolBar";
import { Icon } from "../Icon/Icon";
import { ToolButton } from "../ToolButton/ToolButton";
import { ToolSeparator } from "../ToolSeparator/ToolSeparator";
import { ToolSpacer } from "../ToolSpacer/ToolSpacer";
import { ToolTab } from "../ToolTab/ToolTab";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/ToolBar",
  component: ToolBar,
  argTypes: {
    children: { control: false, table: false },
  },
} as ComponentMeta<typeof ToolBar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ToolBar> = (args) => (
  <ToolBar {...args}>
    <ToolTab label={"Canvas"} active={true} key={"tab0"} />
    <ToolButton icon={<Icon>💡</Icon>} key={0} />
    <ToolButton active={true} icon={<Icon>🎓</Icon>} key={1} />
    <ToolSeparator key={2} />
    <ToolButton icon={<Icon>🧲</Icon>} key={3} />
    <ToolButton icon={<Icon>🧵</Icon>} key={4} />
    <ToolSpacer key={5} />
    <ToolButton icon={<Icon>🚧</Icon>} key={6} />
  </ToolBar>
);

export const Default = Template.bind({});
Default.args = {};

export const Small = Template.bind({});
Small.args = { size: "small" };

export const Narrow: ComponentStory<typeof ToolBar> = (args) => (
  <div style={{ width: "200px" }}>
    <ToolBar {...args}>
      <ToolTab label={"Canvas"} active={true} key={"tab0"} />
      <ToolButton icon={<Icon>💡</Icon>} key={0} />
      <ToolButton active={true} icon={<Icon>🎓</Icon>} key={1} />
      <ToolSeparator key={2} />
      <ToolButton icon={<Icon>🧲</Icon>} key={3} />
      <ToolButton icon={<Icon>🧵</Icon>} key={4} />
      <ToolSpacer key={5} />
      <ToolButton icon={<Icon>🚧</Icon>} key={6} />
    </ToolBar>
  </div>
);
