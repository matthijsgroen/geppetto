import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import "./menu.css";
import styles from "./menu.module.css";
import { MenuItem as ReactMenuItem, MenuItemProps } from "@szhsin/react-menu";
import { className } from "../className";
export {
  Menu,
  ControlledMenu,
  MenuButton,
  MenuRadioGroup,
  MenuGroup,
  SubMenu,
  MenuDivider,
  MenuHeader,
  useMenuState,
} from "@szhsin/react-menu";

type Props = { shortcut?: string } & MenuItemProps;

export const MenuItem: React.FC<Props> = ({ shortcut, children, ...props }) => (
  <ReactMenuItem {...props}>
    {shortcut
      ? (state) => {
          const node =
            typeof children === "function" ? children(state) : children;

          return (
            <div className={styles.shortcutDivider}>
              <span className={styles.wide}>{node}</span>
              <span
                className={className({
                  [styles.shortcut]: true,
                  [styles.disabled]: state.disabled,
                })}
              >
                {shortcut}
              </span>
            </div>
          );
        }
      : children}
  </ReactMenuItem>
);
