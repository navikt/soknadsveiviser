import React, { CSSProperties } from "react";
import { Sidetittel, Normaltekst } from "nav-frontend-typografi";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import errorIcon from "../../img/error.png";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { sideTittel, storForsteBokstav } from "../../utils/sprak";

interface Props {
  style?: CSSProperties;
  message?: string;
}
const NotFound = (props: Props & InjectedIntlProps) => {
  document.title = sideTittel(
    storForsteBokstav(`${props.intl.formatMessage({ id: "notFound.tittel" })}`)
  );

  return (
    <div className="notFound__container" style={props.style}>
      <img className="notFound__icon" alt={props.message} src={errorIcon} />
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
        <Link to="/soknader">
          <FormattedMessage id="notFound.goto.soknadsveiviser" />
        </Link>
      </Normaltekst>
    </div>
  );
};

export default injectIntl<Props & InjectedIntlProps>(NotFound);
