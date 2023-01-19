import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Panel as PanelComponent } from "./Panel";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Panel",
  component: PanelComponent,
  argTypes: {
    children: { control: false, table: false },
  },
  args: {
    padding: 0,
    workspace: false,
    center: false,
    fitContent: false,
    scrollable: false,
  },
} as ComponentMeta<typeof PanelComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PanelComponent> = (args) => (
  <PanelComponent {...args} />
);

export const Panel = Template.bind({});
Panel.args = {
  children: "Lorem Ipsum",
};

export const ScrollableWorkspace = Template.bind({});
ScrollableWorkspace.args = {
  children: (
    <div
      style={{ width: "120vw", height: 30, backgroundColor: "hotpink" }}
    ></div>
  ),
  workspace: true,
  scrollable: true,
  padding: 10,
};

export const FitContent = Template.bind({});
FitContent.args = {
  children: "Lorem Ipsum",
  fitContent: true,
};
