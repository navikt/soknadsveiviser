import React, { CSSProperties } from "react";
import { Sidetittel, Ingress, Normaltekst } from "nav-frontend-typografi";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import errorIcon from "../../img/error.png";

interface Props {
  style?: CSSProperties;
  message?: string;
}
const NotFound = (props: Props) => (
  <div className="notFound__container" style={props.style}>
    <img className="notFound__icon" src={errorIcon} />
    <div className="notFound__title">
      <Sidetittel>
        <FormattedMessage id="notFound.tittel" />
      </Sidetittel>
    </div>
    {props.message && (
      <div className="notFound__message">
        <Normaltekst>
          <FormattedMessage id={props.message} />
        </Normaltekst>
      </div>
    )}
    <div className="notFound__content">
      <Normaltekst>
        <FormattedMessage id="notFound.beskrivelse" />
      </Normaltekst>
    </div>
    <Normaltekst>
      <a href="https://nav.no">
        <FormattedMessage id="notFound.goto.nav" />
      </a>
    </Normaltekst>
    <Normaltekst>
      <Link to="/soknadsveiviser">
        <FormattedMessage id="notFound.goto.soknadsveiviser" />
      </Link>
    </Normaltekst>
  </div>
);

export default NotFound;
