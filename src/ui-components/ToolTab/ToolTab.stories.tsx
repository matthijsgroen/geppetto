import { ComponentStory, ComponentMeta } from "@storybook/react";
import { expect } from "@storybook/jest";
import { userEvent, waitFor, within } from "@storybook/testing-library";
import { ToolTab as ToolTabComponent } from "./ToolTab";
import { Icon } from "../Icon/Icon";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/ToolTab",
  component: ToolTabComponent,
  argTypes: {
    icon: { control: false },
    label: { control: "text" },
  },
  args: {
    disabled: false,
    active: false,
  },
} as ComponentMeta<typeof ToolTabComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ToolTabComponent> = (args) => (
  <ToolTabComponent {...args} />
);

export const ToolTab = Template.bind({});
ToolTab.args = {
  icon: <Icon>💡</Icon>,
  label: "Canvas",
};
ToolTab.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getByRole("button"));
  await waitFor(() => expect(args.onClick).toHaveBeenCalled());
};

export const Active = Template.bind({});
Active.args = {
  icon: <Icon>💡</Icon>,
  active: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  icon: <Icon>💡</Icon>,
  disabled: true,
};
Disabled.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getByRole("button"));
  await waitFor(() => expect(args.onClick).not.toHaveBeenCalled());
};

export const ActiveDisabled = Template.bind({});
ActiveDisabled.args = {
  icon: <Icon>💡</Icon>,
  disabled: true,
  active: true,
};
