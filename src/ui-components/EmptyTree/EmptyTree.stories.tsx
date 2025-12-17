import { EmptyTree } from "./EmptyTree";
import preview from "#.storybook/preview";

const meta = preview.meta({
  title: "Molecules/EmptyTree",
  component: EmptyTree,
  args: {},
});
export default meta;

export const Empty = meta.story();

export const WithContent = meta.story({
  args: {
    children: "No items to display",
  },
});
