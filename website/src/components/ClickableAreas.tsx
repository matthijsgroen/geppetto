import React, { FunctionComponent } from "react";

type Area = {
  id: string;
  top: number;
  left: number;
  bottom: number;
  right: number;
  onClick: () => void;
  cursor: string;
};

type Props = {
  areas: Area[];
};

const ClickableAreas: FunctionComponent<Props> = ({ children }) => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
};

export default ClickableAreas;
