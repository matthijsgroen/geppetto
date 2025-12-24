import preview from "@sb/preview";
import { expect, fn, waitFor } from "storybook/test";

import { Icon } from "@/ui/components/atoms/Icon/Icon";

import { ToolButton } from "./ToolButton";

const meta = preview.meta({
  title: "Atoms/ToolButton",
  component: ToolButton,
  argTypes: {
    icon: { control: false },
    onClick: { control: false },
    onKeyDown: { control: false },
    ref: { control: false },
    onContextMenu: { control: false },
    label: { control: "text" },
    tooltip: { control: "text" },
  },
  args: {
    disabled: false,
    active: false,
    notificationBadge: false,
    standAlone: false,
    onClick: fn(),
  },
});
export default meta;

export const Default = meta.story({
  args: {
    icon: <Icon>💡</Icon>,
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button"));
    await expect(args.onClick).toHaveBeenCalled();
  },
});

export const Active = meta.story({
  args: {
    icon: <Icon>💡</Icon>,
    active: true,
  },
});

export const WithLabel = meta.story({
  args: {
    icon: <Icon>💡</Icon>,
    label: "Button",
  },
});

export const Disabled = meta.story({
  args: {
    icon: <Icon>💡</Icon>,
    disabled: true,
  },
  play: async ({ args, canvas, userEvent }) => {
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
