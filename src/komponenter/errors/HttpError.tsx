import React, { CSSProperties } from "react";
import AlertStripe from "nav-frontend-alertstriper";
import { HTTPError } from "../../typer/errors";
import { FormattedMessage } from "react-intl";

interface props {
  style?: CSSProperties;
  error: HTTPError;
}

const Error = (props: props) => {
  const { error } = props;
  return (
    <div className="error__container" style={props.style}>
      <AlertStripe type="advarsel">
        <FormattedMessage id="errors.api.fetch" />
        <br />
        {error.code && error.text && (
          <span>{`${error.code}: ${error.text}`}</span>
        )}
      </AlertStripe>
    </div>
  );
};

export default Error;
