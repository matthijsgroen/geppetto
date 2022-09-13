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
      <TimeEvent start={1000} end={4000} label={"Control2"} curve="easeIn" />
      <TimeEvent start={6000} end={9000} label={"Control2"} curve="easeOut" />
      <TimeEvent
        start={3000}
        end={5000}
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
