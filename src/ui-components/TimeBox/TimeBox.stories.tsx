import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TimeBox as TimeBoxComponent, TimeEvent } from "./TimeBox";

export default {
  title: "Components/TimeBox",
  component: TimeBoxComponent,
} as ComponentMeta<typeof TimeBoxComponent>;

const Template: ComponentStory<typeof TimeBoxComponent> = (args) => (
  <TimeBoxComponent {...args}>
    <TimeEvent start={3000} end={5000} label={"Control1"} />
    <TimeEvent start={6000} end={9000} label={"Control2"} />
  </TimeBoxComponent>
);

export const TimeBox = Template.bind({});
TimeBox.args = {
  zoom: 1.0,
};
