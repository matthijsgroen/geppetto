import preview from "@sb/preview";

import { Column as ColumnComponent } from "./Column";

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
      <div className="size-12 bg-blue-400" key="1" />,
      <div className="size-12 bg-red-400" key="2" />,
    ],
  },
});
