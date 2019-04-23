import * as React from "react";

export const link = (props: any) => (
  <a href={props.mark.href} className="lenke">
    {props.children}
  </a>
);
