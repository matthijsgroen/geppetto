import type { ComponentProps, FC, PropsWithChildren } from "react";

import { type Vec2 } from "@/shared/types/global";

const Point: FC<ComponentProps<"div">> = ({ children, ...props }) => (
  <div
    {...props}
    className="absolute z-10 size-2.5 rounded-full border-2 border-black bg-control-edge"
  >
    {children}
  </div>
);

export const DebugMutatorPoint: React.FC<{ point: Vec2 }> = ({ point }) => {
  return <Point style={{ left: point[0] - 6, top: point[1] - 6 }} />;
};
