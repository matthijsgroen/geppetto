import { Row as RowComponent } from "./Row";
import preview from "#.storybook/preview";

const meta = preview.meta({
  title: "Molecules/Row",
  component: RowComponent,
  argTypes: {
    children: { control: false },
  },
});
export default meta;

export const Row = meta.story({
  args: {
    children: [
      <div key="1" className="size-12 bg-blue-400"></div>,
      <div key="2" className="size-12 bg-red-400"></div>,
    ],
  },
});
