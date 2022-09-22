import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TimeBox } from "./TimeBox";
import { TimeEvent as TimeEventComponent, TimeLineCurves } from "./TimeEvent";
import { controlPropsArgTypes } from "../generic/ControlPropsStoryHelpers";
import { expect } from "@storybook/jest";
import { userEvent, waitFor, within } from "@storybook/testing-library";

export default {
  title: "Components/TimeBar/TimeEvent",
  component: TimeEventComponent,
  argTypes: {
    icon: { control: false },
    ...controlPropsArgTypes,
  },
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
        easing="easeIn"
      />
      <TimeEventComponent
        startTime={3000}
        endTime={5000}
        row={1}
        label={"Control with a really long name"}
        easing={"easeInOut"}
      />
      <TimeEventComponent {...args} />
    </TimeBox>
  </>
);

export const TimeEvent = Template.bind({});
TimeEvent.args = {};

TimeEvent.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);

  const cell = canvas.getAllByRole("gridcell").at(2)!;
  expect(cell).toBeInTheDocument();
  await userEvent.click(cell);
  await waitFor(() => expect(args.onClick).toHaveBeenCalled());
};
