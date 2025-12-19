import preview from "#.storybook/preview";

import { FoundationItem, FoundationList } from "./foundation";

const meta = preview.meta({
  title: "Foundations/Colors",
  args: {},
});
export default meta;

export const Colors = meta.story({
  render: () => (
    <FoundationList title="Colors">
      {[
        "bg-control-default",
        "bg-workspace",

        "bg-panel",
        "bg-notification",

        "bg-control-default",
        "bg-control-edge",
        "bg-control-focus",
        "bg-control-highlight",
        "bg-control-active",
        "bg-control-active-dimmed",

        "bg-text",
        "bg-dimmed",
        "bg-active",
      ].map((color) => (
        <FoundationItem key={color} label={color.slice(3)}>
          <div className={`${color} rounded-control size-20 shadow-md`}>
            &nbsp;
          </div>
        </FoundationItem>
      ))}
    </FoundationList>
  ),
});
