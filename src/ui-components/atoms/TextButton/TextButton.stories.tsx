import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import preview from "#.storybook/preview";

import { TextButton as TextButtonComponent } from "./TextButton";

const meta = preview.meta({
  title: "Atoms/TextButton",
  component: TextButtonComponent,
  argTypes: {
    onClick: { control: false },
  },
  args: {
    children: "Hello world",
    onClick: fn(),
  },
  decorators: [
    (Story) => (
      <p className="text-text">
        This is a paragraph. <Story /> is inside a paragraph.
      </p>
    ),
  ],
});
export default meta;

export const TextButton = meta.story({
  args: {
    children: "Hello world",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button"));
    await waitFor(() => expect(args.onClick).toHaveBeenCalled());
  },
});
