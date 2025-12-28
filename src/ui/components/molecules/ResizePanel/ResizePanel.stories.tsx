import preview from "@sb/preview";
import { expect } from "storybook/test";

import drag from "@/shared/test/dragTestHelper";
import { Column } from "@/ui/components/molecules/Column/Column";
import { Panel } from "@/ui/components/molecules/Panel/Panel";
import { Row } from "@/ui/components/molecules/Row/Row";

import { ResizeDirection, ResizePanel } from "./ResizePanel";

const direction = {
  North: ResizeDirection.North,
  South: ResizeDirection.South,
  East: ResizeDirection.East,
  West: ResizeDirection.West,
};

const meta = preview.meta({
  title: "Molecules/ResizePanel",
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
});

export const Default = meta.story({
  render: (args) => {
    if (args.direction === ResizeDirection.East) {
      return (
        <Row>
          <ResizePanel {...args}>
            <Panel padding="md">
              <p>Resizable panel</p>
            </Panel>
          </ResizePanel>
          <Panel center workspace>
            <p>Other content</p>
          </Panel>
        </Row>
      );
    }
    if (args.direction === ResizeDirection.North) {
      return (
        <Column>
          <Panel center workspace>
            <p>Other content</p>
          </Panel>
          <ResizePanel {...args}>
            <Panel padding="md">
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
            <Panel padding="md">
              <p>Resizable panel</p>
            </Panel>
          </ResizePanel>
          <Panel center workspace>
            <p>Other content</p>
          </Panel>
        </Column>
      );
    }
    return (
      <Row>
        <Panel center workspace>
          <p>Other content</p>
        </Panel>
        <ResizePanel {...args}>
          <Panel padding="md">
            <p>Resizable panel</p>
          </Panel>
        </ResizePanel>
      </Row>
    );
  },
  play: async ({ canvas }) => {
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
  },
});
