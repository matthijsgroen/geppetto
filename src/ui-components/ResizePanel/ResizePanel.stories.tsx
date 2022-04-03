import { ComponentStory, ComponentMeta } from "@storybook/react";
import { className } from "../className";
// import { expect } from "@storybook/jest";
// import { userEvent, waitFor, within } from "@storybook/testing-library";
import { ResizeDirection, ResizePanel } from "./ResizePanel";
import styles from "./ResizePanel.module.css";

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
    direction: ResizeDirection.East,
  },
} as ComponentMeta<typeof ResizePanel>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ResizePanel> = (args) => (
  <div className={styles.storyPanel}>
    <ResizePanel direction={args.direction}>
      <div>
        <p>Resizable panel</p>
      </div>
    </ResizePanel>
    <div
      className={className({ [styles.panel]: true, [styles.content]: true })}
    >
      <p>Other content</p>
    </div>
  </div>
);

export const Default = Template.bind({});
