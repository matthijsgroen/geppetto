import { StoryObj, Meta } from "@storybook/react-vite";
import { Panel as PanelComponent } from "./Panel";

const meta = {
  title: "Components/Panel",
  component: PanelComponent,
  argTypes: {
    children: { control: false },
    padding: {
      control: { type: "radio" },
      options: ["none", "sm", "md"],
      mapping: {
        none: undefined,
        sm: "sm",
        md: "md",
      },
    },
  },
  args: {
    padding: "sm",
    workspace: false,
    center: false,
    fitContent: false,
  },
} satisfies Meta<typeof PanelComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Panel: Story = {
  args: {
    children: "Lorem Ipsum",
  },
};
