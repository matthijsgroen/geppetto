import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TimeBox } from "./TimeBox";
import { TimeEvent as TimeEventComponent, TimeLineCurves } from "./TimeEvent";

export default {
  title: "Components/TimeBar/TimeEvent",
  component: TimeEventComponent,
  args: {
    start: 5000,
    end: 7000,
    label: "Control2",
  },
} as ComponentMeta<typeof TimeEventComponent>;

const Template: ComponentStory<typeof TimeEventComponent> = (args) => (
  <>
    <TimeLineCurves />
    <TimeBox>
      <TimeEventComponent
        start={1000}
        end={4000}
        label={"Control2"}
        curve="easeIn"
      />
      <TimeEventComponent {...args} />
      <TimeEventComponent
        start={3000}
        end={5000}
        label={"Control with a really long name"}
        curve={"easeInOut"}
      />
    </TimeBox>
  </>
);

export const TimeEvent = Template.bind({});
TimeEvent.args = {};
