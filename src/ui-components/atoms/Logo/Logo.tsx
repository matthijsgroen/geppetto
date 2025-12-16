import LogoSvg from "./geppetto.svg?react";
import { Icon } from "../Icon/Icon";
import { FC } from "react";

export const LogoIcon: FC = () => (
  <Icon>
    <LogoSvg width={20} />
  </Icon>
);

export const Logo: FC = () => (
  <div className="bg-control-default rounded-3xl shadow-xl aspect-square h-[min(20vh,200px)] mx-auto">
    <LogoSvg />
  </div>
);
