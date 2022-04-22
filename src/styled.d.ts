// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      backgroundDestructive: string;
      textDestructive: string;

      background: string;
      backgroundWorkspace: string;
      backgroundNotification: string;

      itemContainerBackground: string;
      // text: string;
      // backgroundSelected: string;
      // itemSelected: string;
      // itemSpecial: string;

      textDefault: string;
      textDimmed: string;
      textActive: string;
      textFocus: string;

      controlDefault: string;
      controlEdge: string;
      controlHighlight: string;
      controlActive: string;
      controlFocus: string;
    };
  }
}
