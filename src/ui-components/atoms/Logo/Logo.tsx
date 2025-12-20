import { type FC } from "react";

import { Icon } from "../Icon/Icon";
import LogoSvg from "./geppetto.svg?react";

export const LogoIcon: FC = () => (
  <Icon>
    <LogoSvg width={20} />
  </Icon>
);

export const Logo: FC = () => (
  <div className="bg-panel mx-auto aspect-square h-[min(20vh,200px)] rounded-control-large shadow-xl">
    <LogoSvg />
  </div>
);
