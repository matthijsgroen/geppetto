import preview from "@sb/preview";
import { fn } from "storybook/test";

import { AnimationsContainer, AnimationTrack } from "@/ui/components";

import { TimeBar as TimeBarComponent } from "./TimeBar";

const meta = preview.meta({
  title: "Atoms/Time/TimeBar",
  component: TimeBarComponent,
  args: {
    duration: 5,
    selected: false,
    start: 4,
    trackIndex: 0,
    variant: "default",
    easing: "linear",
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["default", "mini"],
    },
    duration: { control: { type: "number", min: 0, max: 20, step: 0.1 } },
    start: { control: { type: "number", min: 0, max: 20, step: 0.1 } },
    trackIndex: { control: { type: "number", min: 0, max: 5, step: 1 } },
    easing: {
      control: { type: "select" },
      options: ["linear", "easeIn", "easeOut", "easeInOut"],
    },
  },
  decorators: [
    (Story, { args }) => (
      <AnimationsContainer duration={30} title="Timeline" zoom={2}>
        <AnimationTrack
          length={20}
          name={`Track 1`}
          selected={args.variant === "default"}
          trackNames={["Control 1", "Control 2"]}
        >
          <Story />
          <TimeBarComponent
            duration={3}
            selected={false}
            start={2}
            trackIndex={1}
          />
        </AnimationTrack>
      </AnimationsContainer>
    ),
  ],
});

export default meta;

export const TimeBar = meta.story();
