import preview from "@sb/preview";

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
          <div className={`${radius} size-20 bg-panel shadow-md`}>&nbsp;</div>
        </FoundationItem>
      ))}
    </FoundationList>
  ),
});
