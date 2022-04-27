import { ComponentMeta, ComponentStory, Story } from "@storybook/react";
import { Control } from "./Control";
import { ControlPanel as ControlPanelComponent } from "./ControlPanel";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const story = {
  title: "Components/ControlPanel",
  component: ControlPanelComponent,
  argTypes: {
    children: { control: false, table: false },
  },
} as ComponentMeta<typeof ControlPanelComponent>;
export default story;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ControlPanelComponent> = (args) => (
  <ControlPanelComponent {...args} />
);

export const ControlPanel = Template.bind({});
ControlPanel.args = {
  children: (
    <>
      <Control label="Hello">
        <input type="checkbox" />
      </Control>
      <Control label="Hello with a really long name">
        <input type="checkbox" />
      </Control>
    </>
  ),
};
