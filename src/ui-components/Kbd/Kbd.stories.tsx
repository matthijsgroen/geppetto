import React from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd as KbdElement } from "./Kbd";
import { Shortcut } from "./shortcut";

type StoryProps = {
  interaction: Shortcut["interaction"];
  disabled?: boolean;
  dimmed?: boolean;
  inMenu?: boolean;
  ctrlOrCmd: boolean;
  shift: boolean;
  alt: boolean;
  mac: boolean;
};

const StoryTemplate: React.FC<StoryProps> = ({
  interaction = "KeyO",
  ctrlOrCmd,
  shift,
  alt,
  mac,
  ...props
}) => {
  const shortcut: Shortcut = { interaction, ctrlOrCmd, shift, alt, mac };
  return (
    <div>
      <p style={{ background: "var(--colors-control-default)", margin: 0 }}>
        <KbdElement shortcut={shortcut} {...props} />
      </p>
    </div>
  );
};

const meta = {
  title: "Elements/Kbd",
  component: StoryTemplate,
  argTypes: {
    ctrlOrCmd: { control: "boolean" },
    shift: { control: "boolean" },
    alt: { control: "boolean" },
    interaction: {
      options: [
        "KeyO",
        "KeyS",
        "Backspace",
        "Delete",
        "DelOrBackspace",
        "MouseDrag",
      ],
      control: "select",
    },
  },
  args: {
    interaction: "KeyO",
    disabled: false,
    ctrlOrCmd: false,
    shift: false,
    alt: false,
    mac: false,
    dimmed: false,
    inMenu: false,
  },
} satisfies Meta<StoryProps>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Kbd: Story = {};
