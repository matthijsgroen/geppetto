import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Panel } from "../Panel/Panel";
import { Control as ControlComponent } from "./Control";
import { ControlPanel } from "./ControlPanel";
import { NumberInput } from "./NumberInput";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const story = {
  title: "Components/Control",
  component: ControlComponent,
  argTypes: {
    children: { control: false, table: false },
  },
  args: { label: "Label" },
} as ComponentMeta<typeof ControlComponent>;
export default story;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ControlComponent> = (args) => (
  <Panel padding={5}>
    <ControlPanel>
      <ControlComponent label={args.label}>{args.children}</ControlComponent>
    </ControlPanel>
  </Panel>
);

export const Control = Template.bind({});
Control.args = {
  children: <input type="checkbox" />,
};

export const NumberControl = Template.bind({});
NumberControl.args = {
  children: <NumberInput value={10} prefix="x:" />,
};
export const VectorControl = Template.bind({});
VectorControl.args = {
  children: [
    <NumberInput key={"x"} value={10} prefix="x:" />,
    <NumberInput key={"y"} value={10} prefix="y:" />,
  ],
};

export const SliderControl = Template.bind({});
SliderControl.args = {
  children: <input type="range" value={10} />,
};
