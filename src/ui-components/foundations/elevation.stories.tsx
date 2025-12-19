import preview from "#.storybook/preview";

import { FoundationItem, FoundationList } from "./foundation";

const meta = preview.meta({
  title: "Foundations/Elevation",
  args: {},
});
export default meta;

export const Elevation = meta.story({
  render: () => (
    <FoundationList title="Elevation">
      {["shadow-sm", "shadow-md", "shadow-xl", "shadow-inset-sm"].map(
        (elevation) => (
          <FoundationItem key={elevation} label={elevation}>
            <div className={`bg-panel rounded-control size-20 ${elevation}`}>
              &nbsp;
            </div>
          </FoundationItem>
        )
      )}
    </FoundationList>
  ),
});
