import preview from "#.storybook/preview";

import { FoundationItem, FoundationList } from "./foundation";

const meta = preview.meta({
  title: "Foundations/Radii",
  args: {},
});
export default meta;

export const Radii = meta.story({
  render: () => (
    <FoundationList title="Radii">
      {[
        "rounded-control-small",
        "rounded-control",
        "rounded-control-large",
        "rounded-full",
      ].map((radius) => (
        <FoundationItem key={radius} label={radius}>
          <div className={`${radius} bg-control-default size-20 shadow-md`}>
            &nbsp;
          </div>
        </FoundationItem>
      ))}
    </FoundationList>
  ),
});
