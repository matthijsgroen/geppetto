import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Column } from "../Column/Column";
import { Panel } from "../Panel/Panel";
import { Row } from "../Row/Row";
import { ResizeDirection, ResizePanel } from "./ResizePanel";
import { expect } from "@storybook/jest";
import { within } from "@storybook/testing-library";
import drag from "./dragTestHelper";

const direction = {
  North: ResizeDirection.North,
  South: ResizeDirection.South,
  East: ResizeDirection.East,
  West: ResizeDirection.West,
};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/ResizePanel",
  component: ResizePanel,
  argTypes: {
    direction: {
      options: Object.keys(direction),
      mapping: direction,
      control: { type: "radio" },
    },
  },
  args: {
    direction: direction.East,
    minSize: 40,
    maxSize: 400,
    defaultSize: 125,
  },
} as ComponentMeta<typeof ResizePanel>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ResizePanel> = (args) => {
  if (args.direction === ResizeDirection.East) {
    return (
      <Row>
        <ResizePanel {...args}>
          <Panel padding={10}>
            <p>Resizable panel</p>
          </Panel>
        </ResizePanel>
        <Panel workspace center>
          <p>Other content</p>
        </Panel>
      </Row>
    );
  }
  if (args.direction === ResizeDirection.North) {
    return (
      <Column>
        <Panel workspace center>
          <p>Other content</p>
        </Panel>
        <ResizePanel {...args}>
          <Panel padding={10}>
            <p>Resizable panel</p>
          </Panel>
        </ResizePanel>
      </Column>
    );
  }
  if (args.direction === ResizeDirection.South) {
    return (
      <Column>
        <ResizePanel {...args}>
          <Panel padding={10}>
            <p>Resizable panel</p>
          </Panel>
        </ResizePanel>
        <Panel workspace center>
          <p>Other content</p>
        </Panel>
      </Column>
    );
  }
  return (
    <Row>
      <Panel workspace center>
        <p>Other content</p>
      </Panel>
      <ResizePanel {...args}>
        <Panel padding={10}>
          <p>Resizable panel</p>
        </Panel>
      </ResizePanel>
    </Row>
  );
};

export const Default = Template.bind({});
Default.args = {
  direction: direction.East,
};
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const resizeHandle = canvas.getByRole("separator");
  expect(resizeHandle).toHaveAttribute("aria-orientation", "vertical");

  const panel = resizeHandle.parentElement;
  if (panel) {
    const style = window.getComputedStyle(panel);
    expect(style).toHaveProperty("width", "125px");

    await drag(resizeHandle, { delta: { x: 100, y: 0 }, steps: 1 });
    const resizedStyle = window.getComputedStyle(panel);
    expect(resizedStyle).toHaveProperty("width", "225px");

    await drag(resizeHandle, { delta: { x: -100, y: 0 }, steps: 1 });
    const resizedBackStyle = window.getComputedStyle(panel);
    expect(resizedBackStyle).toHaveProperty("width", "125px");
  }
};
