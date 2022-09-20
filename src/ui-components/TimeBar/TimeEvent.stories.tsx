import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TimeBox } from "./TimeBox";
import { TimeEvent as TimeEventComponent, TimeLineCurves } from "./TimeEvent";

export default {
  title: "Components/TimeBar/TimeEvent",
  component: TimeEventComponent,
  args: {
    startTime: 5000,
    endTime: 7000,
    row: 0,
    label: "Control2",
  },
} as ComponentMeta<typeof TimeEventComponent>;

const Template: ComponentStory<typeof TimeEventComponent> = (args) => (
  <>
    <TimeLineCurves />
    <TimeBox>
      <TimeEventComponent
        startTime={1000}
        endTime={4000}
        row={0}
        label={"Control2"}
        curve="easeIn"
      />
      <TimeEventComponent {...args} />
      <TimeEventComponent
        startTime={3000}
        endTime={5000}
        row={1}
        label={"Control with a really long name"}
        curve={"easeInOut"}
      />
    </TimeBox>
  </>
);

export const TimeEvent = Template.bind({});
TimeEvent.args = {};
