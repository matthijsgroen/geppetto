import preview from "@sb/preview";

import { Row as RowComponent } from "./Row";

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
      <div className="size-12 bg-blue-400" key="1" />,
      <div className="size-12 bg-red-400" key="2" />,
    ],
  },
});
