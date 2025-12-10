import { StoryObj, Meta } from "@storybook/react-vite";
import { ToolButton } from "./ToolButton";
import { Icon } from "../Icon/Icon";
import { fn, waitFor, expect } from "storybook/test";

const meta = {
  title: "Components/ToolButton",
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
    shadow: false,
    onClick: fn(),
  },
} satisfies Meta<typeof ToolButton>;
export default meta;

type Story = StoryObj<typeof ToolButton>;
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Default: Story = {
  args: {
    icon: <Icon>💡</Icon>,
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button"));
    await expect(args.onClick).toHaveBeenCalled();
  },
};

export const Active: Story = {
  args: {
    icon: <Icon>💡</Icon>,
    active: true,
  },
};

export const WithLabel: Story = {
  args: {
    icon: <Icon>💡</Icon>,
    label: "Button",
  },
};

export const Disabled: Story = {
  args: {
    icon: <Icon>💡</Icon>,
    disabled: true,
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button"));
    await waitFor(() => expect(args.onClick).not.toHaveBeenCalled());
  },
};

export const ActiveDisabled: Story = {
  args: {
    icon: <Icon>💡</Icon>,
    disabled: true,
    active: true,
  },
};
