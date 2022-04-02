// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      backgroundDestructive: string;
      textDestructive: string;

      background: string;
      backgroundSecondary: string;

      itemContainerBackground: string;
      // text: string;
      // backgroundSelected: string;
      // itemSelected: string;
      // itemSpecial: string;

      textDefault: string;
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
