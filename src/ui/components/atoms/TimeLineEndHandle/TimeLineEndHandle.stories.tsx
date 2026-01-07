import preview from "@sb/preview";

import {
  AnimationsContainer,
  AnimationTrack,
  TimeBar,
  TimePin,
} from "@/ui/components";

import { TimeLineEndHandle as TimeLineEndHandleComponent } from "./TimeLineEndHandle";

const meta = preview.meta({
  title: "Atoms/Time/TimeLineEndHandle",
  component: TimeLineEndHandleComponent,
  args: {
    location: 8.5,
    trackIndex: 0,
    loop: false,
  },
  argTypes: {
    location: { control: { type: "number", min: 0, max: 20, step: 0.1 } },
  },
  decorators: [
    (Story, { args }) => (
      <AnimationsContainer duration={30} title="Timeline" zoom={2}>
        <AnimationTrack
          length={20}
          loop={args.loop}
          name={`Track 1`}
          selected={true}
          trackNames={["Control 1", "Control 2"]}
        >
          <TimePin activeTrack={false} label={"Marker"} location={5} />
          <TimeBar duration={3} easing="easeInOut" start={4} trackIndex={0} />
          <Story />
        </AnimationTrack>
      </AnimationsContainer>
    ),
  ],
});

export default meta;

export const TimeLineEndHandle = meta.story({});
