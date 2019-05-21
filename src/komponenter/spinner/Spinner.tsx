import React, { CSSProperties } from "react";
import NavFrontendSpinner from "nav-frontend-spinner";

interface Props {
  style?: CSSProperties;
}

const Spinner = (props: Props) => (
  <div className="spinner__container" style={props.style}>
    <NavFrontendSpinner type="XL" />
  </div>
);
export default Spinner;
