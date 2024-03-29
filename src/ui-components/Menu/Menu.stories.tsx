import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Icon } from "../Icon/Icon";
import { ToolButton } from "../ToolButton/ToolButton";
import { Menu, MenuDivider, MenuHeader, MenuItem, SubMenu } from "./Menu";

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
    <MenuItem shortcut={{ interaction: "KeyS", ctrlOrCmd: true }}>
      Save
    </MenuItem>
    <MenuDivider />
    <MenuHeader>Edit</MenuHeader>
    <SubMenu label="Edit">
      <MenuItem shortcut={{ interaction: "KeyX", ctrlOrCmd: true, alt: true }}>
        Cut
      </MenuItem>
      <MenuItem shortcut={{ interaction: "KeyC", shift: true }}>Copy</MenuItem>
      <MenuItem
        disabled
        shortcut={{ interaction: "KeyV", shift: true, alt: true }}
      >
        Paste
      </MenuItem>
    </SubMenu>
    <MenuItem>Print...</MenuItem>
  </Menu>
);
