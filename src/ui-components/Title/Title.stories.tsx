import { StoryObj, Meta } from "@storybook/react-vite";
import { Title as TitleElement } from "./Title";

const meta = {
  title: "Elements/Title",
  component: TitleElement,
} satisfies Meta<typeof TitleElement>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Title: Story = {
  args: {
    children: "️Hello world",
  },
};
