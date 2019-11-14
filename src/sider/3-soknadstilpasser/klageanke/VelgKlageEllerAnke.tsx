import React, { Component } from "react";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import Underbanner from "komponenter/bannere/Underbanner";
import { Soknadsobjekt } from "typer/soknad";
import { localeTekst } from "utils/sprak";
import { medValgtSoknadsobjekt } from "states/providers/ValgtSoknadsobjekt";
import { sideTittel } from "utils/sprak";
import { Normaltekst, Undertittel } from "nav-frontend-typografi";
import { Link } from "react-router-dom";
import NotFound from "../../404/404";

interface Props {
  valgtSoknadsobjekt: Soknadsobjekt;
}

interface Routes {
  sprak: string;
  personEllerBedrift: string;
  ettersendelse: string;
  skjemanummer: string;
  kategori: string;
  underkategori: string;
}

type MergedProps = Props & RouteComponentProps<Routes> & InjectedIntlProps;
class VelgKlageEllerAnke extends Component<MergedProps> {
  render() {
    const { valgtSoknadsobjekt } = this.props;
    const { intl, match } = this.props;
    const { hovedskjema, kanKlage } = valgtSoknadsobjekt;

    document.title = sideTittel(
      `${localeTekst(
        valgtSoknadsobjekt.navn,
        intl.locale
      )} - ${intl.formatMessage({
        id: "anke.eller.klage.sidetittel"
      })}`
    );

    const {
      sprak,
      skjemanummer,
      kategori,
      underkategori,
      personEllerBedrift
    } = match.params;

    if (kanKlage) {
      return (
        <>
          <Underbanner
            tittel={localeTekst(valgtSoknadsobjekt.navn, intl.locale)}
            undertittel={localeTekst(hovedskjema.navn, intl.locale)}
            skjemanummer={hovedskjema.skjemanummer}
          />
          <div className="klageanke__container">
            <div className="klageanke__innhold">
              <Undertittel>
                <FormattedMessage id="klage.mellomledd.tittel" />
              </Undertittel>
              <Normaltekst>
                <FormattedMessage id="klage.mellomledd.beskrivelse" />
              </Normaltekst>
            </div>
            <div className="klageanke__knapper">
              <Link
                to={
                  `/soknader` +
                  `/${sprak}` +
                  `/${personEllerBedrift}` +
                  `/${kategori}` +
                  `/${underkategori}` +
                  `/${skjemanummer}/brev` +
                  `/klage`
                }
                className="knapp knapp-hoved"
              >
                <FormattedMessage id="klage.mellomledd.knapp" />
              </Link>
            </div>
          </div>
          <div className="klageanke__container">
            <div className="klageanke__innhold">
              <Undertittel>
                <FormattedMessage id="anke.mellomledd.tittel" />
              </Undertittel>
              <Normaltekst>
                <FormattedMessage id="anke.mellomledd.beskrivelse" />
              </Normaltekst>
            </div>
            <div className="klageanke__knapper">
              <Link
                to={
                  `/soknader` +
                  `/${sprak}` +
                  `/${personEllerBedrift}` +
                  `/${kategori}` +
                  `/${underkategori}` +
                  `/${skjemanummer}/brev` +
                  `/anke`
                }
                className="knapp knapp-hoved"
              >
                <FormattedMessage id="anke.mellomledd.knapp" />
              </Link>
            </div>
          </div>
        </>
      );
    }
    return <NotFound />;
  }
}

export default medValgtSoknadsobjekt(
  injectIntl<Props & InjectedIntlProps>(
    withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>, any>(
      VelgKlageEllerAnke
    )
  )
);
