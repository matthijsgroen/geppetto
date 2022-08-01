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
  args: {
    size: "default",
    vertical: false,
    children: [
      <ToolTab label={"Canvas"} active={true} key={"tab0"} />,
      <ToolButton icon={<Icon>💡</Icon>} key={0} />,
      <ToolButton active={true} icon={<Icon>🎓</Icon>} key={1} />,
      <ToolSeparator key={2} />,
      <ToolButton icon={<Icon>🧲</Icon>} key={3} />,
      <ToolButton icon={<Icon>🧵</Icon>} key={4} />,
      <ToolSpacer key={5} />,
      <ToolButton icon={<Icon>🚧</Icon>} key={6} />,
    ],
  },
} as ComponentMeta<typeof ToolBar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ToolBar> = (args) => (
  <ToolBar {...args} />
);

export const Default: typeof Template = Template.bind({});
Default.args = { size: "default" };

export const Small: typeof Template = Template.bind({});
Small.args = { size: "small" };

export const Narrow: typeof Template = Template.bind({});
Narrow.decorators = [
  (Story) => (
    <div style={{ width: "200px" }}>
      <Story />
    </div>
  ),
];
