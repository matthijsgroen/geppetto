import preview from "#.storybook/preview";

import { Column } from "../Column/Column";
import { Panel } from "../Panel/Panel";
import { Row } from "../Row/Row";
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
          <Panel padding="md">
            <p>Resizable panel</p>
          </Panel>
        </ResizePanel>
      </Row>
    );
  },
});
