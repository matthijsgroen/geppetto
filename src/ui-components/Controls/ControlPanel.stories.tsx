import { ComponentMeta, Story } from "@storybook/react";
import { ComponentProps } from "react";
import { CheckInput } from "../Inputs/CheckInput";
import { Control } from "./Control";
import { ControlPanel as ControlPanelComponent } from "./ControlPanel";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const story = {
  title: "Components/ControlPanel",
  component: ControlPanelComponent,
  argTypes: {
    children: { control: false, table: false },
    extraControlCount: { control: "number", table: false },
  },
  args: {
    shadow: false,
    extraControlCount: 2,
  },
} as ComponentMeta<typeof ControlPanelComponent>;
export default story;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: Story<
  ComponentProps<typeof ControlPanelComponent> & { extraControlCount: number }
> = ({ extraControlCount, children, ...args }) => (
  <div>
    <ControlPanelComponent {...args}>
      {children}
      {Array.from({ length: extraControlCount ?? 0 }).map((_, index) => (
        <Control label={`Extra Field ${index + 1}`} key={index}>
          <CheckInput value={true} />
        </Control>
      ))}
    </ControlPanelComponent>
  </div>
);

export const ControlPanel = Template.bind({});
ControlPanel.args = {
  children: [
    <Control label="Hello" key="field1">
      <CheckInput value={true} />
    </Control>,
    <Control label="Hello with a really long name" key="field2">
      <CheckInput value={true} />
    </Control>,
  ],
};
