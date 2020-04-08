import * as React from "react";
import { ReactNode } from "react";

export const TopplinjeContainer = (props: { children: ReactNode }) => (
  <div className="topplinje__container">{props.children}</div>
);
