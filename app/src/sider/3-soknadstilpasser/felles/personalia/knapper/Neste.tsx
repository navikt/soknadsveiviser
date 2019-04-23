import * as React from "react";
import { Knapp } from "nav-frontend-knapper";
import { FormattedMessage } from "react-intl";

const NesteKnapp = () => (
  <div className="knapp__neste">
    <Knapp className="knapp knapp--hoved sentrert__knapp row" htmlType="submit">
      <FormattedMessage id="personalia.knapp" />
    </Knapp>
  </div>
);

export default NesteKnapp;
