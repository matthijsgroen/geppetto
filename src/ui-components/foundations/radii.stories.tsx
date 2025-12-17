import preview from "#.storybook/preview";

const meta = preview.meta({
  title: "Foundations/Radii",
  args: {},
});
export default meta;

export const Radii = meta.story({
  render: () => (
    <div className="grid grid-cols-2 gap-4 h-fit text-text m-4">
      {[
        "rounded-control-small",
        "rounded-control",
        "rounded-control-large",
        "rounded-full",
      ].map((radius) => (
        <>
          <div key={radius} className="flex items-center">
            <p>{radius}</p>
          </div>
          <div>
            <div className={`${radius} bg-control-default size-20 shadow-md`}>
              &nbsp;
            </div>
          </div>
        </>
      ))}
    </div>
  ),
});
