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
  finnesDigitalEttersendelse,
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
    const erDigitalEttersendelse = finnesDigitalEttersendelse(valgtSoknadsobjekt, intl.locale);

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
        {erDigitalEttersendelse &&  (
          <DigitalEttersendelse
            url={urlTilDokumentinnsendingEllerSoknadsdialog(
              this.props.match.url,
              valgtSoknadsobjekt,
              intl.locale
            )}
          />
        )}
        <PapirEttersendelse digitalEttersendelse={erDigitalEttersendelse} />
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
      soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog.ettersendelse &&
      soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog.ettersendelse.ettersendelsesURL &&
      soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog.ettersendelse.ettersendelsesURL.nb) ?
      localeTekst(soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog.ettersendelse.ettersendelsesURL, locale)
      : `${getTjenesteUrl()}/saksoversikt/ettersending`;
};
