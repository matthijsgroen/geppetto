import preview from "#.storybook/preview";

import { Title as TitleComponent } from "./Title";

const meta = preview.meta({
  title: "Atoms/Title",
  component: TitleComponent,
});

export default meta;

export const Title = meta.story({
  args: {
    children: "️Hello world",
  },
});
