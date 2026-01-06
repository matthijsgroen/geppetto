import preview from "@sb/preview";

import { AnimationsContainer, AnimationTrack } from "@/ui/components";

import { TimePin as TimePinComponent } from "./TimePin";

const meta = preview.meta({
  title: "Atoms/TimePin",
  component: TimePinComponent,
  args: {
    location: 3.5,
    activeTrack: false,
    label: "Marker",
  },
  decorators: [
    (Story, { args }) => (
      <AnimationsContainer duration={30} zoom={1}>
        <AnimationTrack
          trackNames={["Control 1", "Control 2"]}
          name={`Track 1`}
          selected={args.activeTrack}
        >
          <Story />
        </AnimationTrack>
        <AnimationTrack
          trackNames={["Control 1"]}
          name={`ShadowTrack 1`}
          selected={false}
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
