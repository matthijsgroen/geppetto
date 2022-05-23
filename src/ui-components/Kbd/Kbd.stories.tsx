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
    key: {
      options: ["KeyO", "KeyS", "Backspace", "Delete", "DelOrBackspace"],
      control: "select",
    },
  },
  args: {
    key: "KeyO",
    disabled: false,
    ctrlOrCmd: false,
    shift: false,
    alt: false,
    mac: false,
  },
} as ComponentMeta<typeof KbdElement>;

type StoryProps = {
  key: Shortcut["key"];
  disabled?: boolean;
  ctrlOrCmd: boolean;
  shift: boolean;
  alt: boolean;
  mac: boolean;
};

const Template: React.FC<StoryProps> = ({
  disabled,
  key = "KeyO",
  ctrlOrCmd,
  shift,
  alt,
  mac,
}) => {
  const shortcut: Shortcut = { key, ctrlOrCmd, shift, alt, mac };
  return (
    <div>
      <p style={{ background: "white", margin: 0 }}>
        <KbdElement shortcut={shortcut} disabled={disabled} />
      </p>
    </div>
  );
};

export const Kbd = Template.bind({});
