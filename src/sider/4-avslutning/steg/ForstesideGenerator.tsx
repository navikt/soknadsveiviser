import React, { useState } from "react";
import StegOverskrift from "./Overskrift";
import { Vedleggsobjekt } from "../../../typer/skjemaogvedlegg";
import { Soknadsobjekt } from "../../../typer/soknad";
import { RouteComponentProps } from "react-router-dom";
import { withRouter } from "react-router";
import {
  medPersonalia,
  Personalia
} from "../../../states/providers/Personalia";
import { FormattedMessage } from "react-intl";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { hentForsteside, Params } from "./utils/forsteside/forsteside";
import { lastNedFilBase64 } from "./utils/pdf";
import { medValgtSoknadsobjekt } from "../../../states/providers/ValgtSoknadsobjekt";
import { Hovedknapp } from "nav-frontend-knapper";
import { Klage } from "../../../typer/store";
import ReactGA from "react-ga";
import AlertStripe from "nav-frontend-alertstriper";
import HotJarLenke from "../../../komponenter/felles/HotJarLenke";


ReactGA.initialize("UA-9127381-16");
ReactGA.set({ anonymizeIp: true });

interface Routes {
  ettersendelse?: string;
  kategori?: string;
  underkategori?: string;
  personEllerBedrift?: string;
}

interface Props {
  steg: number;
  skalKlage?: boolean;
  typeKlage?: Klage;
  skalAnke?: boolean;
  ettersendelse?: string;
  relevanteVedlegg: Vedleggsobjekt[];
  skjemaSprak: string;
}

interface ValgtSoknad {
  valgtSoknadsobjekt: Soknadsobjekt;
  klageSoknadsobjekt: Soknadsobjekt;
}

type MergedProps = Props &
  ValgtSoknad &
  Personalia &
  InjectedIntlProps &
  RouteComponentProps<Routes>;

type State =
  | { status: "READY" }
  | { status: "LOADING" }
  | { status: "FETCH_COVER" }
  | { status: "MERGE" }
  | { status: "DOWNLOAD" }
  | { status: "ERROR"; error: Error };
type StatusCheck = { [key in State["status"]]: any };

const ForstesideGenerator = (props: MergedProps) => {
  const [state, setState] = useState({ status: "READY" } as State);

  const genererPDF = async () => {
    setState({ status: "LOADING" });

    const { skalKlage, typeKlage, skalAnke } = props;
    const { params } = props.match;
    const { valgtSoknadsobjekt, klageSoknadsobjekt, relevanteVedlegg } = props;
    const valgtLocale = props.skjemaSprak;
    const globalLocale = props.intl.locale;

    const ettersendelse = !!(
      params.ettersendelse ||
      ((skalAnke || skalKlage) && typeKlage && typeKlage.skalEttersende)
    );

    const { kategori, underkategori, personEllerBedrift } = params;

    ReactGA.event({
      category: "Søknadsveiviser",
      action: "Last ned førsteside",
      label: `/${personEllerBedrift}/${kategori}/${underkategori}/${valgtSoknadsobjekt.hovedskjema.skjemanummer}/nedlasting/forsteside`
    });

    const personalia = {
      fodselsnummer: props.fodselsnummer,
      adresse: props.adresse,
      touched: props.touched,
      bedrift: props.bedrift
    };

    const foerstesideParams = {
      personalia,
      relevanteVedlegg,
      valgtSoknadsobjekt,
      klageSoknadsobjekt,
      globalLocale,
      valgtLocale,
      ettersendelse,
      skalKlage,
      typeKlage,
      skalAnke
    } as Params;

    // 1) Generer førsteside
    // 3) Last ned sammenslått pdf
    // 4) Last ned andre vedlegg
    setState({ status: "FETCH_COVER" });
    hentForsteside(foerstesideParams)
      .then(samletPdf => {
        setState({ status: "DOWNLOAD" });
        const navn = props.intl.formatMessage({
          id: "avslutning.steg.forsteside.pdf.tittel"
        });
        lastNedFilBase64(samletPdf, `NAV - ${navn}`, "pdf");
      })
      .then(() => {
        setState({ status: "READY" });
      })
      .catch(error => {
        setState({ status: "ERROR", error });
      });
  };

  const { steg } = props;
  const knappAktiv = state.status !== "READY" && state.status !== "ERROR";
  return (
    <div className="steg__rad">
      <StegOverskrift
        steg={steg}
        tittel="avslutning.steg.forsteside.tittel"
        beskrivelse="avslutning.steg.forsteside.beskrivelse"
      />
      <div className="forsteside__nedlasting">
        <Hovedknapp
          onClick={genererPDF}
          className="nedlastningsknapp knapp knapp--hoved innsendingsvalg__knapp"
          spinner={knappAktiv}
          autoDisableVedSpinner={true}
        >
          <FormattedMessage
            id={
              ({
                READY: "avslutning.steg.lastned.knapp.ready",
                LOADING: "avslutning.steg.lastned.knapp.loading",
                FETCH_COVER: "avslutning.steg.lastned.knapp.cover",
                MERGE: "avslutning.steg.lastned.knapp.merge",
                DOWNLOAD: "avslutning.steg.lastned.knapp.download",
                ERROR: "avslutning.steg.lastned.knapp.ready"
              } as StatusCheck)[state.status]
            }
          />
        </Hovedknapp>
      </div>
      {state.status === 'ERROR' &&

        <div>
        <br/>
        <AlertStripe type="feil">
          <FormattedMessage id="avslutning.steg.forsteside.nedlastingsfeil" />
          <br />
          <HotJarLenke trigger="rr_trigger">  
            <FormattedMessage id="avslutning.steg.forsteside.nedlastingsfeil.hotjartrigger" />
          </HotJarLenke>
        </AlertStripe>
        </div>
      }
    </div>
  );
};

export default medValgtSoknadsobjekt<Props & ValgtSoknad>(
  injectIntl<Props & ValgtSoknad & InjectedIntlProps>(
    withRouter<
      Props & ValgtSoknad & InjectedIntlProps & RouteComponentProps<Routes>,
      any
    >(
      medPersonalia<
        Personalia &
          Props &
          ValgtSoknad &
          InjectedIntlProps &
          RouteComponentProps<Routes>
      >(ForstesideGenerator)
    )
  )
);
