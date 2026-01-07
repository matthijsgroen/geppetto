import preview from "@sb/preview";

import { Icon } from "@/ui/components/atoms/Icon/Icon";
import { ToolButton } from "@/ui/components/atoms/ToolButton/ToolButton";

import { ToolGrid } from "./ToolGrid";

const meta = preview.meta({
  title: "Molecules/ToolGrid",
  component: ToolGrid,
  argTypes: {
    children: { control: false },
  },
  args: {
    children: [
      <ToolButton icon={<Icon>💡</Icon>} key={0} />,
      <ToolButton active icon={<Icon>🎓</Icon>} key={1} />,
      <ToolButton icon={<Icon>🧲</Icon>} key={3} />,
      <ToolButton icon={<Icon>🧵</Icon>} key={4} />,
      <ToolButton icon={<Icon>🚧</Icon>} key={6} />,
    ],
  },
});
export default meta;

export const Default = meta.story();
export const Small = meta.story({
  args: {
    size: "small",
  },
});

export const Wrapped = meta.story({
  decorators: [
    (Story) => (
      <div className="w-24">
        <Story />
      </div>
    ),
  ],
});
