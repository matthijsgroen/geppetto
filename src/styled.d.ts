// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      textDefault: string;
      textDimmed: string;
      textActive: string;
      textFocus: string;

      controlDefault: string;
      controlEdge: string;
      controlHighlight: string;
      controlActive: string;
      controlFocus: string;

      backgroundDestructive: string;
      textDestructive: string;

      background: string;
      backgroundWorkspace: string;
      backgroundPanel: string;
      backgroundNotification: string;

      itemContainerBackground: string;
    };
  }
}
