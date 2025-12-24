import preview from "@sb/preview";

import { Icon as IconElement } from "./Icon";

const meta = preview.meta({
  title: "Atoms/Icon",
  component: IconElement,
});
export default meta;

export const Icon = meta.story({
  args: {
    children: "️💡",
  },
});
