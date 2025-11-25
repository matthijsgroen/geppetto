import { ComponentStory, ComponentMeta } from "@storybook/react-webpack5";
import { expect, fn } from "storybook/test";
import { userEvent, waitFor, within } from "storybook/test";
import { TextButton } from "./TextButton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/TextButton",
  component: TextButton,
  argTypes: {
    onClick: { control: false },
  },
  args: {
    children: "Hello world",
    onClick: fn(),
  },
} as ComponentMeta<typeof TextButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TextButton> = (args) => (
  <p>
    This is a paragraph. <TextButton {...args} /> is inside a paragraph.
  </p>
);

export const Default = Template.bind({});
Default.args = {
  children: "Hello world",
};
Default.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getByRole("button"));
  await waitFor(() => expect(args.onClick).toHaveBeenCalled());
};
