import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import "./menu.css";

import {
  MenuItem as ReactMenuItem,
  type MenuItemProps,
} from "@szhsin/react-menu";

import { Kbd } from "../../atoms/Kbd/Kbd";
import { type Shortcut } from "../../atoms/Kbd/shortcut";
export {
  ControlledMenu,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuHeader,
  MenuRadioGroup,
  SubMenu,
  useMenuState,
} from "@szhsin/react-menu";

type Props = { shortcut?: Shortcut } & MenuItemProps;

export const MenuItem: React.FC<Props> = ({ shortcut, children, ...props }) => (
  <ReactMenuItem {...props}>
    {shortcut
      ? (state) => {
          const node =
            typeof children === "function" ? children(state) : children;

          return (
            <div className="flex w-full flex-row">
              <span className="flex-1">{node}</span>
              <Kbd
                shortcut={shortcut}
                disabled={state.disabled}
                inMenu
                dimmed
              />
            </div>
          );
        }
      : children}
  </ReactMenuItem>
);
