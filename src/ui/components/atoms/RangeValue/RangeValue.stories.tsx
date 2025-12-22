import preview from "#.storybook/preview";

import { RangeValue } from "./RangeValue";

const meta = preview.meta({
  title: "Atoms/RangeValue",
  component: RangeValue,
});

export default meta;

export const Default = meta.story({
  args: { value: 42 },
});

export const WithFormatter = meta.story({
  args: { value: 0.83, formatter: (v) => `${(v * 100).toFixed(0)}%` },
});
