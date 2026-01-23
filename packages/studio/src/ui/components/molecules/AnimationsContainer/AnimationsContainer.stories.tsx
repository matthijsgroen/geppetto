import preview from "@sb/preview";

import { TimeBar, TimeLineEndHandle, TimePin } from "@/ui/components";
import { AnimationTrack } from "@/ui/components/molecules/AnimationTrack/AnimationTrack";

import { AnimationsContainer as AnimationsContainerComponent } from "./AnimationsContainer";

const meta = preview.meta({
  title: "Molecules/AnimationsContainer",
  component: AnimationsContainerComponent,
  argTypes: {
    zoom: {
      control: "select",
      options: [0.5, 1, 1.5, 2, 4, 8],
    },
    children: { control: false },
    momentTimestamp: {
      control: { type: "number", min: 0, step: 1, max: 30 },
    },
    onTimelineMouseDown: { action: "timeline mouse down" },
    onTimelineMouseMove: { action: "timeline mouse move" },
    onTimelineMouseUp: { action: "timeline mouse up" },
  },
  args: {
    duration: 30,
    zoom: 2,
    title: "Timeline",
    showMomentMarker: true,
    momentTimestamp: 0,
    children: (
      <>
        <AnimationTrack
          length={28}
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
          <TimeLineEndHandle location={28} loop={false} trackIndex={0} />
          <TimeLineEndHandle location={28} loop={false} trackIndex={1} />
          <TimeLineEndHandle location={28} loop={false} trackIndex={2} />
        </AnimationTrack>
        <AnimationTrack
          length={28}
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

          <TimeLineEndHandle location={28} loop={false} trackIndex={0} />
          <TimeLineEndHandle location={28} loop={false} trackIndex={1} />
          <TimeLineEndHandle location={28} loop={false} trackIndex={2} />
        </AnimationTrack>
      </>
    ),
  },
});

export default meta;

export const AnimationsContainer = meta.story({});

export const MomentMarker = meta.story({
  args: {
    showMomentMarker: true,
    momentTimestamp: 5.5,
  },
});
