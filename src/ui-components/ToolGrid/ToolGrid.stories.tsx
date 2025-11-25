import { ComponentStory, ComponentMeta } from "@storybook/react-webpack5";
import { ToolGrid } from "./ToolGrid";
import { Icon } from "../Icon/Icon";
import { ToolButton } from "../ToolButton/ToolButton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/ToolGrid",
  component: ToolGrid,
  argTypes: {
    children: { control: false, table: false },
  },
  args: {
    children: [
      <ToolButton icon={<Icon>💡</Icon>} key={0} />,
      <ToolButton active={true} icon={<Icon>🎓</Icon>} key={1} />,
      <ToolButton icon={<Icon>🧲</Icon>} key={3} />,
      <ToolButton icon={<Icon>🧵</Icon>} key={4} />,
      <ToolButton icon={<Icon>🚧</Icon>} key={6} />,
    ],
  },
} as ComponentMeta<typeof ToolGrid>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ToolGrid> = (args) => (
  <ToolGrid {...args} />
);

export const Default = Template.bind({});
export const Small = Template.bind({});
Small.args = {
  size: "small",
};
export const Wrapped: typeof Template = Template.bind({});
Wrapped.decorators = [
  (Story) => (
    <div style={{ width: "6em" }}>
      <Story />
    </div>
  ),
];
