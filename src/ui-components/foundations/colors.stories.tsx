import preview from "#.storybook/preview";

const meta = preview.meta({
  title: "Foundations/Colors",
  args: {},
});
export default meta;

export const Colors = meta.story({
  render: () => (
    <div className="flex flex-row flex-wrap gap-8 self-start p-8">
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
        <div key={color} className="flex w-60 flex-row items-center gap-2">
          <div className="flex flex-1 items-center">
            <p>{color.slice(3)}</p>
          </div>
          <div>
            <div className={`${color} size-20 rounded-control shadow-md`}>
              &nbsp;
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
});
