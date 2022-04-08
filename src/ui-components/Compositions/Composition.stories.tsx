import { Story } from "@storybook/react";
import {
  ToolBar,
  Icon,
  ToolButton,
  ToolSeparator,
  ToolTab,
  ResizePanel,
  ResizeDirection,
  Tree,
} from "../";
import { storyTreeDataProvider } from "../Tree/Tree.stories";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Compositions/Layers",
  argTypes: {
    children: { control: false, table: false },
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: Story = () => (
  <div>
    <ToolBar>
      <ToolTab icon={<Icon>🧬</Icon>} label={"Layers"} active={true} />
      <ToolTab icon={<Icon>🤷🏼</Icon>} label={"Composition"} active={false} />
      <ToolTab icon={<Icon>🏃</Icon>} label={"Animation"} active={false} />
      <ToolSeparator />

      <ToolButton active={true} icon={<Icon>✋</Icon>} tooltip="Move mode" />
      <ToolButton icon={<Icon>🔧</Icon>} tooltip="Adjust point mode" />
      <ToolButton icon={<Icon>✏️</Icon>} tooltip="Add point mode" />
      <ToolSeparator />
      <ToolButton
        icon={<Icon>🗑</Icon>}
        disabled={true}
        tooltip="Remove selected point"
      />
      <ToolSeparator />
      <ToolButton icon={"-"} tooltip="Decrease grid size" />
      <ToolTab
        icon={<Icon>📏</Icon>}
        label={"32"}
        tooltip="Toggle grid visibility"
      />
      <ToolButton icon={"+"} tooltip="Increase grid size" />
      <ToolButton icon={<Icon>🧲</Icon>} tooltip="Toggle magnetic grid" />
    </ToolBar>

    <div
      style={{
        height: "30em",
        display: "flex",
        flexFlow: "row nowrap",
      }}
    >
      <ResizePanel direction={ResizeDirection.East}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <ToolBar>
            <ToolButton icon={<Icon>📄</Icon>} label="+" tooltip="Add layer" />
            <ToolButton icon={<Icon>📁</Icon>} label="+" tooltip="Add folder" />
            <ToolButton
              icon={<Icon>📑</Icon>}
              disabled={true}
              tooltip="Copy layer"
            />
            <ToolButton
              icon={<Icon>🗑</Icon>}
              disabled={true}
              tooltip="Remove item"
            />
            <ToolButton
              icon={<Icon>⬆</Icon>}
              disabled={true}
              tooltip="Move item up"
            />
            <ToolButton
              icon={<Icon>⬇</Icon>}
              disabled={true}
              tooltip="Move item down"
            />
          </ToolBar>
          <div
            style={{
              padding: "10px",
              backgroundColor: "var(--colors-control-default)",
              color: "var(--colors-text-default)",
              width: "calc(100% - 20px)",
              height: "calc(100% - 20px)",
            }}
          >
            <Tree dataProvider={storyTreeDataProvider} />
          </div>
        </div>
      </ResizePanel>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 2,
          background: "gray",
        }}
      >
        <p>Other content</p>
      </div>
    </div>
  </div>
);

export const Layers = Template.bind({});
