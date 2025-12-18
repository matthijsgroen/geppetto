import preview from "#.storybook/preview";

import { Logo as LogoElement, LogoIcon as LogoIconElement } from "./Logo";

const meta = preview.meta({
  title: "Atoms/Logo",
  component: LogoElement,
  tags: ["svg"],
});
export default meta;

export const Logo = meta.story();

export const LogoIcon = meta.story({
  render: () => <LogoIconElement />,
});
