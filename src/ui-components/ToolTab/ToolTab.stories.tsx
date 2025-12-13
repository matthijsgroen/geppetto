import { expect, fn } from "storybook/test";
import { userEvent, waitFor, within } from "storybook/test";
import { ToolTab as ToolTabComponent } from "./ToolTab";
import { Icon } from "../Icon/Icon";
import { Meta, StoryObj } from "@storybook/react-vite";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/ToolTab",
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
} as Meta<typeof ToolTabComponent>;

type Story = StoryObj<typeof ToolTabComponent>;

export const ToolTab: Story = {
  args: {
    icon: <Icon>💡</Icon>,
    label: "Canvas",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button"));
    await waitFor(() => expect(args.onClick).toHaveBeenCalled());
  },
};

export const Active: Story = {
  args: {
    icon: <Icon>💡</Icon>,
    active: true,
  },
};

export const Disabled: Story = {
  args: {
    icon: <Icon>💡</Icon>,
    disabled: true,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

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
