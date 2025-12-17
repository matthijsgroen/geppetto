import preview from "#.storybook/preview";

const meta = preview.meta({
  title: "Foundations/Radii",
  args: {},
});
export default meta;

export const Radii = meta.story({
  render: () => (
    <div className="flex flex-row flex-wrap gap-8 self-start p-8">
      {[
        "rounded-control-small",
        "rounded-control",
        "rounded-control-large",
        "rounded-full",
      ].map((radius) => (
        <div key={radius} className="flex w-60 flex-row items-center gap-2">
          <div className="flex flex-1 items-center">
            <p>{radius}</p>
          </div>
          <div>
            <div className={`${radius} size-20 bg-control-default shadow-md`}>
              &nbsp;
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
});
