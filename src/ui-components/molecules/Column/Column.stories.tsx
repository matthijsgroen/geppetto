import { Column as ColumnComponent } from "./Column";
import preview from "#.storybook/preview";

const meta = preview.meta({
  title: "Molecules/Column",
  component: ColumnComponent,
  argTypes: {
    children: { control: false },
  },
});
export default meta;

export const Column = meta.story({
  args: {
    children: [
      <div key="1" className="size-12 bg-blue-400"></div>,
      <div key="2" className="size-12 bg-red-400"></div>,
    ],
  },
});
