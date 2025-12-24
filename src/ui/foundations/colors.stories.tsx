import preview from "@sb/preview";

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
        "bg-workspace",

        "bg-toolbar",
        "bg-notification",

        "bg-panel",
        "bg-control-interaction",
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
          <div className={`${color} size-20 rounded-control shadow-md`}>
            &nbsp;
          </div>
        </FoundationItem>
      ))}
    </FoundationList>
  ),
});
