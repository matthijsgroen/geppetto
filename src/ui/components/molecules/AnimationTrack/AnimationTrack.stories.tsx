import preview from "@sb/preview";

import { AnimationsContainer, TimeBar, TimePin } from "@/ui/components";

import { AnimationTrack as AnimationTrackComponent } from "./AnimationTrack";

const meta = preview.meta({
  title: "Molecules/AnimationTrack",
  component: AnimationTrackComponent,
  argTypes: {
    trackNames: { control: false },
    children: { control: false },
  },
  args: {
    name: "Track 1",
    selected: false,
    trackNames: ["Control 1", "Control 2", "Control 3"],
    children: (
      <>
        <TimeBar duration={5} easing="easeInOut" start={10} trackIndex={0} />
        <TimeBar duration={8} easing="linear" start={20} trackIndex={0} />
        <TimeBar duration={14} easing="easeIn" start={7} trackIndex={1} />
        <TimeBar duration={14} easing="easeOut" start={12} trackIndex={2} />

        <TimePin location={3} />
        <TimePin location={10} />
        <TimePin location={25} />
      </>
    ),
  },
  decorators: [
    (Story, { args }) => (
      <AnimationsContainer duration={30} zoom={1}>
        <Story />
      </AnimationsContainer>
    ),
  ],
});

export default meta;

export const AnimationTrack = meta.story({});
