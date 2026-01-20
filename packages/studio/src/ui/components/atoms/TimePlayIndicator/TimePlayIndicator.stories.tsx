import preview from "@sb/preview";

import {
  AnimationsContainer,
  AnimationTrack,
  TimeBar,
  TimeLineEndHandle,
} from "@/ui/components";

import { TimePlayIndicator as TimePlayIndicatorComponent } from "./TimePlayIndicator";

const meta = preview.meta({
  title: "Atoms/Time/TimePlayIndicator",
  component: TimePlayIndicatorComponent,
  args: {
    trackIndex: 0,
    loop: false,
    playing: true,
    duration: 7,
  },
  decorators: [
    (Story, { args }) => (
      <AnimationsContainer duration={30} title="Timeline" zoom={2}>
        <AnimationTrack
          length={21}
          loop={args.loop}
          name={`Track 1`}
          selected={true}
          trackNames={["Control 1"]}
        >
          <TimeBar duration={3} easing="easeInOut" start={4} trackIndex={0} />
          <TimeLineEndHandle location={7} loop={args.loop} trackIndex={0} />
          <TimePlayIndicatorComponent
            duration={21}
            loop={args.loop}
            playing={args.playing}
          />
          <Story />
        </AnimationTrack>
      </AnimationsContainer>
    ),
  ],
});

export default meta;

export const TimePlayIndicator = meta.story();
