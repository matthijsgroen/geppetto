import { DefaultTheme } from "styled-components";
import "./theme.css";

export const defaultTheme: DefaultTheme = {
  colors: {
    background: "var(--colors-background)",
    backgroundWorkspace: "var(--colors-background-workspace)",
    backgroundPanel: "var(--colors-background-panel)",
    backgroundNotification: "var(--colors-background-notification)",

    backgroundDestructive: "var(--colors-background-destructive)",
    textDestructive: "var(--colors-text-destructive)",

    // backgroundSelected: "var(--colors-background-selected)",
    // itemSelected: "var(--colors-item-selected)",
    // itemSpecial: "var(--colors-item-special)",

    itemContainerBackground: "var(--colors-item-container-background)",

    textDefault: "var(--colors-text-default)",
    textDimmed: "var(--colors-text-dimmed)",
    textActive: "var(--colors-text-active)",
    textFocus: "var(--colors-text-focus)",

    controlDefault: "var(--colors-control-default)",
    controlEdge: "var(--colors-control-edge)",
    controlHighlight: "var(--colors-control-highlight)",
    controlActive: "var(--colors-control-active)",
    controlFocus: "var(--colors-control-focus)",
  },
};
