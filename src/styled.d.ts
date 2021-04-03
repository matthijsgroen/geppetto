// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      background: string;
      backgroundSecondary: string;
      backgroundDestructive: string;
      itemContainerBackground: string;
      text: string;
      backgroundSelected: string;
      textSelected: string;
      itemSelected: string;
      itemSpecial: string;
    };
  }
}
