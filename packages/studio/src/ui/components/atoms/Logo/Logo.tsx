import { type FC } from "react";

import { Icon } from "@/ui/components/atoms/Icon/Icon";

import LogoSvg from "./geppetto.svg?react";

export const LogoIcon: FC = () => (
  <Icon>
    <LogoSvg width={20} />
  </Icon>
);

export const Logo: FC = () => (
  <div className="mx-auto aspect-square h-[min(20vh,200px)] rounded-control-large bg-panel shadow-xl">
    <LogoSvg />
  </div>
);
