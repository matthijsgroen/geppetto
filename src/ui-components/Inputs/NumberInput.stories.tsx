import { ComponentMeta, ComponentStory } from "@storybook/react";
import { NumberInput as NumberInputComponent } from "./NumberInput";
import { expect } from "@storybook/jest";
import { userEvent, waitFor, within } from "@storybook/testing-library";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const story = {
  title: "Elements/NumberInput",
  component: NumberInputComponent,
  args: {
    value: 0,
  },
} as ComponentMeta<typeof NumberInputComponent>;
export default story;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof NumberInputComponent> = (args) => (
  <div>
    <NumberInputComponent {...args} />
  </div>
);

export const Default = Template.bind({});
Default.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const numberField = canvas.getByRole("spinbutton");
  expect(numberField).toHaveValue(0);
  numberField.focus();

  // up, step 1
  userEvent.keyboard("{ArrowUp}");
  await waitFor(() => expect(args.onChange).toHaveBeenCalledWith(1));

  // down, step -1
  userEvent.keyboard("{ArrowDown}");
  await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith(-1));

  // shift up, step 10
  userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
  await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith(10));

  // shift down, step -10
  userEvent.keyboard("{Shift>}{ArrowDown}{/Shift}");
  await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith(-10));

  // alt + shift up, step 0.01
  userEvent.keyboard("{Alt>}{Shift>}{ArrowUp}{/Shift}{/Alt}");
  await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith(0.01));

  // alt + shift down, step -0.01
  userEvent.keyboard("{Alt>}{Shift>}{ArrowDown}{/Shift}{/Alt}");
  await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith(-0.01));

  // meta up, step 100
  userEvent.keyboard("{Meta>}{ArrowUp}{/Meta}");
  await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith(100));

  // meta down, step 100
  userEvent.keyboard("{Meta>}{ArrowDown}{/Meta}");
  await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith(-100));

  // alt up, step 0.1
  userEvent.keyboard("{Alt>}{ArrowUp}{/Alt}");
  await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith(0.1));

  // alt down, step 0.1
  userEvent.keyboard("{Alt>}{ArrowDown}{/Alt}");
  await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith(-0.1));
};
