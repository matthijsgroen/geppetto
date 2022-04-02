import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ToolBar } from "./ToolBar";
import { Icon } from "../Icon/Icon";
import { ToolButton } from "../ToolButton/ToolButton";

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
  <ToolBar {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: [
    <ToolButton icon={<Icon>💡</Icon>} key={0} />,
    <ToolButton active={true} icon={<Icon>🎓</Icon>} key={1} />,
    <ToolButton icon={<Icon>🧲</Icon>} key={2} />,
    <ToolButton icon={<Icon>🧵</Icon>} key={3} />,
  ],
};
