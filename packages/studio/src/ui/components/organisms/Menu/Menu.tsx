import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import "./menu.css";

import {
  MenuItem as ReactMenuItem,
  type MenuItemProps,
} from "@szhsin/react-menu";

import { Kbd } from "@/ui/components/atoms/Kbd/Kbd";
import { type Shortcut } from "@/ui/components/atoms/Kbd/shortcut";
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

type Props = { shortcut?: Shortcut; dangerous?: boolean } & MenuItemProps;

export const MenuItem: React.FC<Props> = ({
  shortcut,
  dangerous = false,
  children,
  ...props
}) => (
  <ReactMenuItem {...props} className={dangerous ? "text-red-400" : undefined}>
    {shortcut
      ? (state) => {
          const node =
            typeof children === "function" ? children(state) : children;

          return (
            <div className="flex w-full flex-row">
              <span className="flex-1">{node}</span>
              <Kbd
                dimmed
                disabled={state.disabled}
                inMenu
                shortcut={shortcut}
              />
            </div>
          );
        }
      : children}
  </ReactMenuItem>
);
