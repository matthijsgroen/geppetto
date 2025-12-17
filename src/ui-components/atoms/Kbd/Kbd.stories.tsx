import React from "react";

import preview from "#.storybook/preview";

import { Kbd as KbdElement } from "./Kbd";
import { type Shortcut } from "./shortcut";

type StoryProps = {
  interaction: Shortcut["interaction"];
  disabled?: boolean;
  dimmed?: boolean;
  inMenu?: boolean;
  ctrlOrCmd: boolean;
  shift: boolean;
  alt: boolean;
  mac: boolean;
}

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

const meta = preview.meta({
  title: "Atoms/Kbd",
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
});
export default meta;

export const Kbd = meta.story();
