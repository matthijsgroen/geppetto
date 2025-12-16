import preview from "#.storybook/preview";
import { Title as TitleElement } from "./Title";

const meta = preview.meta({
  title: "Atoms/Title",
  component: TitleElement,
});
export default meta;

export const Title = meta.story({
  args: {
    children: "️Hello world",
  },
});
