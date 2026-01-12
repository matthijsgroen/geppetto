import preview from "@sb/preview";
import { expect, fn, userEvent } from "storybook/test";

import { RenameInput as RenameInputComponent } from "./RenameInput";

const meta = preview.meta({
  title: "Organisms/RenameInput",
  component: RenameInputComponent,
  argTypes: {
    align: {
      control: { type: "radio" },
      options: ["left", "right", "center"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-48">
        <Story />
        <p>some text for the tests</p>
      </div>
    ),
  ],
});

export default meta;

export const Default = meta.story({
  args: {
    value: "My Item",
    align: "left",
    onRename: fn(),
  },
  play: async ({ canvas, args }) => {
    const button = await canvas.findByRole("button");
    button.click();

    const input = await canvas.findByRole("textbox");
    expect(input).toHaveFocus();

    await userEvent.clear(input);
    await userEvent.type(input, "Renamed Item", { delay: 100 });
    await userEvent.keyboard("{Enter}");

    expect(args.onRename).toHaveBeenCalledWith("Renamed Item");
  },
});

export const BlurWithoutChange = meta.story({
  args: {
    value: "My Item",
    align: "left",
    onRename: fn(),
  },
  play: async ({ canvas, args }) => {
    const button = await canvas.findByRole("button");
    button.click();

    const input = await canvas.findByRole("textbox");
    expect(input).toHaveFocus();

    input.dispatchEvent(new Event("blur", { bubbles: true }));
    const text = await canvas.findByRole("paragraph");
    userEvent.click(text);

    const buttonAfterEscape = await canvas.findByRole("button");
    expect(buttonAfterEscape).toHaveTextContent("My Item");
    expect(args.onRename).not.toHaveBeenCalled();
  },
});

export const BlurWithChange = meta.story({
  args: {
    value: "My Item",
    align: "left",
    onRename: fn(),
  },
  play: async ({ canvas, args }) => {
    const button = await canvas.findByRole("button");
    button.click();

    const input = await canvas.findByRole("textbox");
    expect(input).toHaveFocus();

    await userEvent.clear(input);
    await userEvent.type(input, "Renamed Item", { delay: 100 });

    input.dispatchEvent(new Event("blur", { bubbles: true }));
    const text = await canvas.findByRole("paragraph");
    userEvent.click(text);

    const buttonAfterEscape = await canvas.findByRole("button");
    expect(buttonAfterEscape).toHaveTextContent("My Item");
    expect(args.onRename).toHaveBeenCalledWith("Renamed Item");
  },
});

export const EscapeCancels = meta.story({
  args: {
    value: "My Item",
    align: "left",
    onRename: fn(),
  },
  play: async ({ canvas, args }) => {
    const button = await canvas.findByRole("button");
    button.click();

    const input = await canvas.findByRole("textbox");
    expect(input).toHaveFocus();

    await userEvent.clear(input);
    userEvent.type(input, "Renamed Item", { delay: 100 });
    await userEvent.keyboard("{Escape}");

    const buttonAfterEscape = await canvas.findByRole("button");
    expect(buttonAfterEscape).toHaveTextContent("My Item");
    expect(args.onRename).not.toHaveBeenCalled();
  },
});
