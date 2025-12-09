import { StoryObj, Meta } from "@storybook/react-vite";
import { Icon as IconElement } from "./Icon";

const meta = {
  title: "Elements/Icon",
  component: IconElement,
} satisfies Meta<typeof IconElement>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Icon: Story = {
  args: {
    children: "️💡",
  },
};
