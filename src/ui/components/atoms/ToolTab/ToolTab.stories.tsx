import preview from "@sb/preview";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { Icon } from "../Icon/Icon";
import { ToolTab as ToolTabComponent } from "./ToolTab";

const meta = preview.meta({
  title: "Atoms/ToolTab",
  component: ToolTabComponent,
  argTypes: {
    icon: { control: false },
    label: { control: "text" },
  },
  args: {
    disabled: false,
    active: false,
    vertical: false,
    onClick: fn(),
  },
});
export default meta;

export const ToolTab = meta.story({
  args: {
    icon: <Icon>💡</Icon>,
    label: "Canvas",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button"));
    await waitFor(() => expect(args.onClick).toHaveBeenCalled());
  },
});

export const Active = meta.story({
  args: {
    icon: <Icon>💡</Icon>,
    active: true,
  },
});

export const Disabled = meta.story({
  args: {
    icon: <Icon>💡</Icon>,
    disabled: true,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button"));
    await waitFor(() => expect(args.onClick).not.toHaveBeenCalled());
  },
});

export const ActiveDisabled = meta.story({
  args: {
    icon: <Icon>💡</Icon>,
    disabled: true,
    active: true,
  },
});
