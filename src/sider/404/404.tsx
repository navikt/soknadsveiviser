import React, { Component, CSSProperties } from "react";
import { Sidetittel, Normaltekst } from "nav-frontend-typografi";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import errorIcon from "../../img/error.png";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { sideTittel, storForsteBokstav } from "../../utils/sprak";
import Helmet from "react-helmet";
import { getApplicableSkjemaoversiktRedirect } from "../../redirects/redirects";
import { RouteComponentProps, withRouter } from "react-router";
import { AllRoutes } from "../../redirects/NySkjemaoversiktRedirects";

type Props = {
  style?: CSSProperties;
  message?: string;
} & InjectedIntlProps &
  RouteComponentProps<AllRoutes>;

class NotFound extends Component<Props> {
  render() {
    const { intl, match, style, message } = this.props;

    if (intl.locale !== "en") {
      const redirectUrl = getApplicableSkjemaoversiktRedirect(match?.params);

      console.log(`Redirecting to ${redirectUrl}`);

      window.location.replace(redirectUrl);
      return null;
    }

    const title = sideTittel(storForsteBokstav(`${intl.formatMessage({ id: "notFound.tittel" })}`));

    return (
      <div className="notFound__container" style={style}>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <img className="notFound__icon" alt={message} src={errorIcon} />
        <div className="notFound__title">
          <Sidetittel>
            <FormattedMessage id="notFound.tittel" />
          </Sidetittel>
        </div>
        {message && (
          <div className="notFound__message">
            <Normaltekst>
              <FormattedMessage id={message} />
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
  }
}

export default withRouter(injectIntl<Props & InjectedIntlProps>(NotFound));
