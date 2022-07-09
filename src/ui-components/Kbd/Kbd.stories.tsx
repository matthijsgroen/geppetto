import React from "react";
import { ComponentMeta } from "@storybook/react";
import { Kbd as KbdElement } from "./Kbd";
import { Shortcut } from "./shortcut";

export default {
  title: "Elements/Kbd",
  component: KbdElement,
  argTypes: {
    shortcut: { control: false },
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
} as ComponentMeta<typeof KbdElement>;

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

const Template: React.FC<StoryProps> = ({
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

export const Kbd = Template.bind({});
