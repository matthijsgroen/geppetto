import preview from "#.storybook/preview";

const meta = preview.meta({
  title: "Foundations/Colors",
  args: {},
});
export default meta;

export const Colors = meta.story({
  render: () => (
    <div className="grid grid-cols-2 gap-4 h-fit text-text m-4">
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
        <>
          <div key={color} className="flex items-center">
            <p>{color.slice(3)}</p>
          </div>
          <div>
            <div className={`${color}  size-20 rounded-control shadow-md`}>
              &nbsp;
            </div>
          </div>
        </>
      ))}
    </div>
  ),
});
