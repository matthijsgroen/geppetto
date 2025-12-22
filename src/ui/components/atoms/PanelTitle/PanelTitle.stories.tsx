import preview from "#.storybook/preview";

import { PanelTitle as TitleElement } from "./PanelTitle";

const meta = preview.meta({
  title: "Atoms/PanelTitle",
  component: TitleElement,
});
export default meta;

export const PanelTitle = meta.story({
  args: {
    children: "️Hello world",
  },
});
