import { ComponentMeta, ComponentStory, Story } from "@storybook/react";
import { Control as ControlComponent } from "./Control";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const story = {
  title: "Components/Control",
  component: ControlComponent,
  argTypes: {
    children: { control: false, table: false },
  },
} as ComponentMeta<typeof ControlComponent>;
export default story;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ControlComponent> = (args) => (
  <ControlComponent label={args.label}>
    <input type="checkbox" />
  </ControlComponent>
);

export const Control = Template.bind({});
