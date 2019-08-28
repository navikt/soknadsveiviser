import React, { Component } from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import Underbanner from "../../../komponenter/bannere/Underbanner";
import { Soknadsobjekt } from "../../../typer/soknad";
import DigitalEttersendelse from "./seksjoner/Digital";
import PapirEttersendelse from "./seksjoner/Papir";
import KlageEttersendelse from "./seksjoner/Klage";
import { localeTekst } from "../../../utils/sprak";
import {
  finnesDigitalInnsending,
  finnesDokumentinnsending
} from "../../../utils/soknadsobjekter";
import { medValgtSoknadsobjekt } from "../../../states/providers/ValgtSoknadsobjekt";
import { sideTittel } from "../../../utils/sprak";
import { getTjenesteUrl } from "../../../config";

interface Props {
  valgtSoknadsobjekt: Soknadsobjekt;
}

interface Routes {
  skjemanummer: string;
  kategori: string;
  underkategori: string;
}

type MergedProps = Props & RouteComponentProps<Routes> & InjectedIntlProps;
class DigitalEllerPapirEttersendelse extends Component<MergedProps> {
  render() {
    const { valgtSoknadsobjekt } = this.props;
    const { intl } = this.props;
    const { hovedskjema } = valgtSoknadsobjekt;
    const erDigital = finnesDigitalInnsending(valgtSoknadsobjekt, intl.locale);

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
          undertittel={localeTekst(hovedskjema.navn, intl.locale)}
          skjemanummer={hovedskjema.skjemanummer}
        />
        {erDigital && (
          <DigitalEttersendelse
            url={urlTilDokumentinnsendingEllerSoknadsdialog(
              this.props.match.url,
              valgtSoknadsobjekt,
              intl.locale
            )}
          />
        )}
        <PapirEttersendelse />
        <KlageEttersendelse />
      </>
    );
  }
}

export default medValgtSoknadsobjekt(
  injectIntl<Props & InjectedIntlProps>(
    withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>>(
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

const hentDigitalEttersendelsesURL = (soknadsobjekt: Soknadsobjekt, locale: string) => {
  return (soknadsobjekt.digitalinnsending &&
      soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog &&
      soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog.ettersendelselsURL &&
      soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog.ettersendelselsURL.nb) ?
      localeTekst(soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog.ettersendelselsURL, locale) : `${getTjenesteUrl()}/saksoversikt/ettersending`;
};
