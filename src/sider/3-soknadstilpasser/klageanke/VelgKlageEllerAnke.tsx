import React, { Component } from "react";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import Underbanner from "komponenter/bannere/Underbanner";
import { Soknadsobjekt } from "typer/soknad";
import { localeTekst } from "utils/sprak";
import { medValgtSoknadsobjekt } from "states/providers/ValgtSoknadsobjekt";
import { sideTittel } from "utils/sprak";
import { Normaltekst, Undertittel } from "nav-frontend-typografi";
import NotFound from "../../404/404";
import { kanKlage } from "../../../utils/kanKlage";
import Helmet from "react-helmet";
import Lenke from "nav-frontend-lenker";

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
    const { hovedskjema } = valgtSoknadsobjekt;

    const title = sideTittel(
      `${localeTekst(valgtSoknadsobjekt.navn, intl.locale)} - ${intl.formatMessage({
        id: "anke.eller.klage.sidetittel",
      })}`
    );

    const metaDescription = intl.formatMessage(
      {
        id: "anke.eller.klage.meta_desc",
      },
      { soknadsnavn: localeTekst(valgtSoknadsobjekt.navn, intl.locale) }
    );

    const { sprak, skjemanummer, kategori, underkategori, personEllerBedrift } = match.params;

    const klageAnkeBrevPath = `/soknader/${sprak}/${personEllerBedrift}/${kategori}/${underkategori}/${skjemanummer}`;
    const klageUrl = valgtSoknadsobjekt.klageAnke?.klageUrl || `${klageAnkeBrevPath}/klage/brev`;
    const ankeUrl = `${klageAnkeBrevPath}/anke/brev`;

    if (kanKlage(valgtSoknadsobjekt.klageAnke, personEllerBedrift)) {
      return (
        <>
          <Helmet>
            <title>{title}</title>
            <meta name="description" content={metaDescription} />
          </Helmet>
          <Underbanner
            tittel={localeTekst(valgtSoknadsobjekt.navn, intl.locale)}
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
              <Lenke href={klageUrl} className="knapp knapp-hoved">
                <FormattedMessage id="klage.mellomledd.knapp" />
              </Lenke>
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
              <Lenke href={ankeUrl} className="knapp knapp-hoved">
                <FormattedMessage id="anke.mellomledd.knapp" />
              </Lenke>
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
    withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>, any>(VelgKlageEllerAnke)
  )
);
