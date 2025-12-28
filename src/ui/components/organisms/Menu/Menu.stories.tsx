import preview from "@sb/preview";

import { Icon } from "@/ui/components/atoms/Icon/Icon";
import { ToolButton } from "@/ui/components/atoms/ToolButton/ToolButton";

import { Menu, MenuDivider, MenuHeader, MenuItem, SubMenu } from "./Menu";

const meta = preview.meta({
  title: "Organisms/Menu",
  component: Menu,
  argTypes: {
    children: { control: false },
  },
});
export default meta;

export const Default = meta.story({
  render: () => (
    <Menu
      menuButton={({ open }) => (
        <ToolButton active={open} icon={<Icon>🧵</Icon>} />
      )}
      portal
      transition
    >
      <MenuItem>New File</MenuItem>
      <MenuItem shortcut={{ interaction: "KeyS", ctrlOrCmd: true }}>
        Save
      </MenuItem>
      <MenuDivider />
      <MenuHeader>Edit</MenuHeader>
      <SubMenu label="Edit">
        <MenuItem
          shortcut={{ interaction: "KeyX", ctrlOrCmd: true, alt: true }}
        >
          Cut
        </MenuItem>
        <MenuItem shortcut={{ interaction: "KeyC", shift: true }}>
          Copy
        </MenuItem>
        <MenuItem
          disabled
          shortcut={{ interaction: "KeyV", shift: true, alt: true }}
        >
          Paste
        </MenuItem>
      </SubMenu>
      <MenuItem>Print...</MenuItem>
    </Menu>
  ),
});
