import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Icon } from "../Icon/Icon";
import { ToolButton } from "../ToolButton/ToolButton";
import { Menu, MenuDivider, MenuHeader, MenuItem, SubMenu } from "./Menu";
import { shortcut } from "./shortcut";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Menu",
  component: Menu,
  argTypes: {
    children: { control: false, table: false },
  },
} as ComponentMeta<typeof Menu>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Default: ComponentStory<typeof Menu> = () => (
  <Menu
    portal={true}
    menuButton={({ open }) => (
      <ToolButton icon={<Icon>🧵</Icon>} active={open} />
    )}
    transition
  >
    <MenuItem>New File</MenuItem>
    <MenuItem shortcut={shortcut({ key: "S", ctrlCmd: true })}>Save</MenuItem>
    <MenuDivider />
    <MenuHeader>Edit</MenuHeader>
    <SubMenu label="Edit">
      <MenuItem shortcut={shortcut({ key: "X", ctrlCmd: true, alt: true })}>
        Cut
      </MenuItem>
      <MenuItem shortcut={shortcut({ key: "C", shift: true })}>Copy</MenuItem>
      <MenuItem
        disabled
        shortcut={shortcut({ key: "V", shift: true, alt: true })}
      >
        Paste
      </MenuItem>
    </SubMenu>
    <MenuItem>Print...</MenuItem>
  </Menu>
);
