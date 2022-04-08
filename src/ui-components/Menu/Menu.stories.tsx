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
export const Default: ComponentStory<typeof Menu> = (args) => (
  <Menu menuButton={<ToolButton icon={<Icon>🧵</Icon>} />} transition>
    <MenuItem>New File</MenuItem>
    <MenuItem>Save</MenuItem>
    <MenuDivider />
    <MenuHeader>Edit</MenuHeader>
    <SubMenu label="Edit">
      <MenuItem>Cut</MenuItem>
      <MenuItem>Copy</MenuItem>
      <MenuItem>Paste</MenuItem>
    </SubMenu>
    <MenuItem>Print...</MenuItem>
  </Menu>
);
