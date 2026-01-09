import preview from "@sb/preview";

import { Icon as IconElement } from "./Icon";

const meta = preview.meta({
  title: "Atoms/Icon",
  component: IconElement,
  args: {
    children: "️💡",
    colorize: false,
  },
});
export default meta;

export const Icon = meta.story();

export const ColorizedIcon = meta.story({
  args: {
    colorize: true,
  },
});
