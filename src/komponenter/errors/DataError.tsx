import React, { CSSProperties } from "react";
import AlertStripe from "nav-frontend-alertstriper";
import { FormattedMessage } from "react-intl";

interface props {
  style?: CSSProperties;
  error?: string;
}

const Error = (props: props) => {
  const { error } = props;
  return (
    <div className="error__container" style={props.style}>
      <AlertStripe type="advarsel" solid>
        {error && <FormattedMessage id={error} />}
      </AlertStripe>
    </div>
  );
};

export default Error;
