import * as React from "react";

const PanelRad: React.StatelessComponent<{
  className?: string;
  children?: {};
}> = ({ className, children }) => {
  return (
    <div className={"panelRad " + (className ? className : "")}>{children}</div>
  );
};

PanelRad.displayName = "PanelRad";
export default PanelRad;
