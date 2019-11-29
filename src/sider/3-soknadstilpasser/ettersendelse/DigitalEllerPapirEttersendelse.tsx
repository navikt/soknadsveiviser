import React, { Component } from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import Underbanner from "../../../komponenter/bannere/Underbanner";
import { Soknadsobjekt } from "../../../typer/soknad";
import SoknadEttersendelse from "./seksjoner/Soknad";
import KlageAnkeEttersendelse from "./seksjoner/KlageAnke";
import { localeTekst } from "../../../utils/sprak";
import {
  finnesDigitalEttersendelse,
  finnesDokumentinnsending
} from "../../../utils/soknadsobjekter";
import { medValgtSoknadsobjekt } from "../../../states/providers/ValgtSoknadsobjekt";
import { sideTittel } from "../../../utils/sprak";
import { getTjenesteUrl } from "../../../config";
import { Redirect } from "react-router-dom";
import { kanKlage } from "../../../utils/kanKlage";

interface Props {
  valgtSoknadsobjekt: Soknadsobjekt;
}

interface Routes {
  skjemanummer: string;
  kategori: string;
  underkategori: string;
  sprak: string;
  personEllerBedrift: string;
}

type MergedProps = Props & RouteComponentProps<Routes> & InjectedIntlProps;
class DigitalEllerPapirEttersendelse extends Component<MergedProps> {
  render() {
    const { intl, valgtSoknadsobjekt } = this.props;
    const { hovedskjema } = valgtSoknadsobjekt;
    const erDigitalEttersendelse = finnesDigitalEttersendelse(
      valgtSoknadsobjekt,
      intl.locale
    );
    const {
      sprak,
      personEllerBedrift,
      kategori,
      underkategori,
      skjemanummer
    } = this.props.match.params;

    if (
      !erDigitalEttersendelse &&
      !kanKlage(valgtSoknadsobjekt.kanKlage, personEllerBedrift)
    ) {
      return (
        <Redirect
          to={
            `/soknader` +
            `/${sprak}` +
            `/${personEllerBedrift}` +
            `/${kategori}` +
            `/${underkategori}` +
            `/${skjemanummer}/brev` +
            `/ettersendelse`
          }
        />
      );
    }

    document.title = sideTittel(
      `${localeTekst(
        valgtSoknadsobjekt.navn,
        intl.locale
      )} - ${intl.formatMessage({
        id: "ettersendelser.mellomledd.tittel"
      })}`
    );

    return (
      <>
        <Underbanner
          tittel={localeTekst(valgtSoknadsobjekt.navn, intl.locale)}
          skjemanummer={hovedskjema.skjemanummer}
        />
        <SoknadEttersendelse
          digitalEttersendelse={erDigitalEttersendelse}
          url={urlTilDokumentinnsendingEllerSoknadsdialog(
            this.props.match.url,
            valgtSoknadsobjekt,
            intl.locale
          )}
        />
        {kanKlage(valgtSoknadsobjekt.kanKlage, personEllerBedrift) && (
          <KlageAnkeEttersendelse />
        )}
      </>
    );
  }
}

export default medValgtSoknadsobjekt(
  injectIntl<Props & InjectedIntlProps>(
    withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>, any>(
      DigitalEllerPapirEttersendelse
    )
  )
);

const urlTilDokumentinnsendingEllerSoknadsdialog = (
  path: string,
  valgtSoknadsobjekt: Soknadsobjekt,
  locale: string
) =>
  finnesDokumentinnsending(valgtSoknadsobjekt)
    ? `${path}/dokumentinnsending`
    : hentDigitalEttersendelsesURL(valgtSoknadsobjekt, locale);

const hentDigitalEttersendelsesURL = (
  soknadsobjekt: Soknadsobjekt,
  locale: string
) => {
  return soknadsobjekt.digitalinnsending &&
    soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog &&
    soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog.ettersendelse &&
    soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog.ettersendelse
      .ettersendelsesURL &&
    soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog.ettersendelse
      .ettersendelsesURL.nb
    ? localeTekst(
        soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog.ettersendelse
          .ettersendelsesURL,
        locale
      )
    : `${getTjenesteUrl()}/saksoversikt/ettersending`;
};
