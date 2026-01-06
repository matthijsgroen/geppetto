import preview from "@sb/preview";

import { TimeBar, TimePin } from "@/ui/components";
import { AnimationTrack } from "@/ui/components/molecules/AnimationTrack/AnimationTrack";

import { AnimationsContainer as AnimationsContainerComponent } from "./AnimationsContainer";

const meta = preview.meta({
  title: "Molecules/AnimationsContainer",
  component: AnimationsContainerComponent,
  argTypes: {
    zoom: {
      control: "select",
      options: [0.5, 1, 1.5, 2],
    },
    children: { control: false },
  },
  args: {
    duration: 30,
    zoom: 1,
    title: "Timeline",
    children: (
      <>
        <AnimationTrack
          name="Track 1"
          selected={false}
          trackNames={["Control 1", "Control 2", "Control 3"]}
        >
          <TimeBar duration={5} easing="easeInOut" start={10} trackIndex={0} />
          <TimeBar duration={8} easing="linear" start={20} trackIndex={0} />
          <TimeBar duration={14} easing="easeIn" start={7} trackIndex={1} />
          <TimeBar duration={14} easing="easeOut" start={12} trackIndex={2} />

          <TimePin location={3} />
          <TimePin location={10} />
          <TimePin location={25} />
        </AnimationTrack>
        <AnimationTrack
          name="Track 2"
          selected={true}
          trackNames={["Control 1", "Control 2", "Control 3"]}
        >
          <TimeBar duration={5} easing="easeInOut" start={10} trackIndex={0} />
          <TimeBar duration={8} easing="linear" start={20} trackIndex={0} />
          <TimeBar duration={14} easing="easeIn" start={7} trackIndex={1} />
          <TimeBar duration={14} easing="easeOut" start={12} trackIndex={2} />

          <TimePin location={3} />
          <TimePin location={10} />
          <TimePin location={25} />
        </AnimationTrack>
      </>
    ),
  },
});

export default meta;

export const AnimationsContainer = meta.story({});
