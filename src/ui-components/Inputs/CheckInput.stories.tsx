import { ComponentMeta, ComponentStory } from "@storybook/react";
import { CheckInput as CheckInputComponent } from "./CheckInput";
import { expect } from "@storybook/jest";
import { userEvent, waitFor, within } from "@storybook/testing-library";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const story = {
  title: "Elements/CheckInput",
  component: CheckInputComponent,
  args: {
    value: false,
  },
} as ComponentMeta<typeof CheckInputComponent>;
export default story;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CheckInputComponent> = (args) => (
  <CheckInputComponent {...args} />
);

export const Default = Template.bind({});
Default.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);

  const checkbox = canvas.getByRole("checkbox");
  expect(checkbox).not.toBeChecked();
  await userEvent.click(checkbox);
  await waitFor(() => expect(args.onChange).toHaveBeenCalledWith(true));
};

export const Checked = Template.bind({});
Checked.args = {
  value: true,
};
Checked.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);

  const checkbox = canvas.getByRole("checkbox");
  expect(checkbox).toBeChecked();
  await userEvent.click(checkbox);
  await waitFor(() => expect(args.onChange).toHaveBeenCalledWith(false));
};
