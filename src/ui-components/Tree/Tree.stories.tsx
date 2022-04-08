import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  StaticTreeDataProvider,
  TreeItem,
  TreeItemIndex,
} from "react-complex-tree";
import { Icon } from "../Icon/Icon";
import { ToolButton } from "../ToolButton/ToolButton";
import { Tree, TreeData, TreeDataProvider } from "./Tree";

const treeItems: Record<TreeItemIndex, TreeItem<TreeData>> = {
  root: {
    index: "root",
    canMove: true,
    hasChildren: true,
    children: ["child1", "child2"],
    data: { name: "Root item", icon: "🥕" },
    canRename: true,
  },
  child1: {
    index: "child1",
    canMove: true,
    hasChildren: false,
    children: [],
    data: {
      name: "Child item 1",
      icon: "📄",
      itemTools: <ToolButton size={"small"} icon={<Icon>👁</Icon>} />,
    },
    canRename: true,
  },
  child2: {
    index: "child2",
    canMove: true,
    hasChildren: true,
    children: ["child3", "child4"],
    data: {
      name: "Child item 2",
      icon: "📁",
      itemTools: <ToolButton size={"small"} icon={<Icon>👁</Icon>} />,
    },
    canRename: true,
  },
  child3: {
    index: "child3",
    canMove: true,
    hasChildren: false,
    data: { name: "Mutation", icon: "🟢" },
    canRename: true,
  },
  child4: {
    index: "child4",
    canMove: true,
    hasChildren: false,
    data: { name: "Mutation 2", icon: "🔵" },
    canRename: true,
  },
};

export const storyTreeDataProvider: TreeDataProvider = new StaticTreeDataProvider(
  treeItems,
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
    dataProvider: storyTreeDataProvider,
  },
  argTypes: {
    dataProvider: { control: false },
  },
} as ComponentMeta<typeof Tree>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Tree> = (args) => <Tree {...args} />;

export const Default = Template.bind({});
