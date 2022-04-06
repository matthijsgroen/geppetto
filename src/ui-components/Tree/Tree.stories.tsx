import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  StaticTreeDataProvider,
  TreeItem,
  TreeItemIndex,
} from "react-complex-tree";
import { Tree, TreeData, TreeDataProvider } from "./Tree";

const items: Record<TreeItemIndex, TreeItem<TreeData>> = {
  root: {
    index: "root",
    canMove: true,
    hasChildren: true,
    children: ["child1", "child2"],
    data: { name: "Root item" },
    canRename: true,
  },
  child1: {
    index: "child1",
    canMove: true,
    hasChildren: false,
    children: [],
    data: { name: "Child item 1" },
    canRename: true,
  },
  child2: {
    index: "child2",
    canMove: true,
    hasChildren: true,
    children: ["child3", "child4"],
    data: { name: "Child item 2" },
    canRename: true,
  },
  child3: {
    index: "child3",
    canMove: true,
    hasChildren: false,
    data: { name: "Mutation" },
    canRename: true,
  },
  child4: {
    index: "child4",
    canMove: true,
    hasChildren: false,
    data: { name: "Mutation 2" },
    canRename: true,
  },
};

const provider: TreeDataProvider = new StaticTreeDataProvider(
  items,
  (item, newName) => ({
    ...item,
    data: { ...item.data, name: newName },
  })
);

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Tree",
  component: Tree,
  args: {
    dataProvider: provider,
  },
  argTypes: {
    dataProvider: { control: false },
  },
} as ComponentMeta<typeof Tree>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Tree> = (args) => <Tree {...args} />;

export const Default = Template.bind({});
