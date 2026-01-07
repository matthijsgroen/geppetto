import preview from "@sb/preview";

import {
  AnimationsContainer,
  TimeBar,
  TimeLineEndHandle,
  TimePin,
} from "@/ui/components";

import { AnimationTrack as AnimationTrackComponent } from "./AnimationTrack";

const meta = preview.meta({
  title: "Molecules/AnimationTrack",
  component: AnimationTrackComponent,
  argTypes: {
    trackNames: { control: false },
    children: { control: false },
    length: { control: { type: "number", min: 0, max: 30, step: 1 } },
  },
  args: {
    name: "Track 1",
    selected: false,
    length: 15,
    trackNames: ["Control 1", "Control 2", "Control 3"],
    loop: false,
    children: (
      <>
        <TimeBar duration={2.5} easing="easeInOut" start={5} trackIndex={0} />
        <TimeBar duration={4} easing="linear" start={10} trackIndex={0} />
        <TimeBar duration={7} easing="easeIn" start={3.5} trackIndex={1} />
        <TimeBar duration={7} easing="easeOut" start={6} trackIndex={2} />
        <TimeLineEndHandle location={15} loop={false} trackIndex={0} />
        <TimeLineEndHandle location={12.5} loop={false} trackIndex={1} />
        <TimeLineEndHandle location={13} loop={false} trackIndex={2} />

        <TimePin location={1.5} />
        <TimePin location={5} />
        <TimePin location={12.5} />
      </>
    ),
  },
  decorators: [
    (Story, { args }) => (
      <AnimationsContainer duration={30} title="Timeline" zoom={2}>
        <Story />
      </AnimationsContainer>
    ),
  ],
});

export default meta;

export const AnimationTrack = meta.story({});
