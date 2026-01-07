import preview from "@sb/preview";

import { AnimationsContainer, AnimationTrack } from "@/ui/components";

import { TimePin as TimePinComponent } from "./TimePin";

const meta = preview.meta({
  title: "Atoms/Time/TimePin",
  component: TimePinComponent,
  args: {
    location: 3.5,
    activeTrack: false,
    label: "Marker",
  },
  decorators: [
    (Story, { args }) => (
      <AnimationsContainer duration={30} title="Timeline" zoom={2}>
        <AnimationTrack
          length={20}
          name={`Track 1`}
          selected={args.activeTrack}
          trackNames={["Control 1", "Control 2"]}
        >
          <Story />
        </AnimationTrack>
        <AnimationTrack
          length={20}
          name={`ShadowTrack 1`}
          selected={false}
          trackNames={["Control 1"]}
        >
          <TimePinComponent
            activeTrack={false}
            label={"Shadow Marker"}
            location={5}
          />
        </AnimationTrack>
      </AnimationsContainer>
    ),
  ],
});

export default meta;

export const TimePin = meta.story({});
