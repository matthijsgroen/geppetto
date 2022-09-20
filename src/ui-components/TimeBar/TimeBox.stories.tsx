import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TimeBox as TimeBoxComponent } from "./TimeBox";
import { TimeEvent, TimeLineCurves } from "./TimeEvent";

export default {
  title: "Components/TimeBar/TimeBox",
  component: TimeBoxComponent,
} as ComponentMeta<typeof TimeBoxComponent>;

const Template: ComponentStory<typeof TimeBoxComponent> = (args) => (
  <>
    <TimeLineCurves />
    <TimeBoxComponent {...args}>
      <TimeEvent
        startTime={1000}
        endTime={4000}
        row={0}
        label={"Control2"}
        curve="easeIn"
      />
      <TimeEvent
        startTime={6000}
        endTime={9000}
        row={0}
        label={"Control2"}
        curve="easeOut"
      />
      <TimeEvent
        startTime={3000}
        endTime={5000}
        row={1}
        label={"Control with a really long name"}
        curve={"easeInOut"}
      />
    </TimeBoxComponent>
  </>
);

export const TimeBox = Template.bind({});
TimeBox.args = {
  zoom: 1.0,
};
