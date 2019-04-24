import React, { useState } from "react";
import StegOverskrift from "./Overskrift";
import { Vedleggsobjekt } from "../../../typer/vedlegg";
import { Soknadsobjekt } from "../../../typer/soknad";
import { RouteComponentProps } from "react-router-dom";
import { AlertStripeStopp } from "nav-frontend-alertstriper";
import { HTTPError } from "../../../typer/errors";
import { withRouter } from "react-router";
import {
  medPersonalia,
  PersonaliaKontekst
} from "../../../states/providers/Personalia";
import { FormattedMessage } from "react-intl";
import { localeTekst } from "../../../utils/sprak";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { hentForsteside } from "./utils/forsteside/forsteside";
import { mergePDF, lastNedPDF, hentPDFurl } from "./utils/pdf";
import { Hovedknapp } from "nav-frontend-knapper";

interface Routes {
  ettersendelse?: string;
  klage?: string;
}

interface Props {
  steg: number;
  valgtSoknadsobjekt: Soknadsobjekt;
  relevanteVedlegg: Vedleggsobjekt[];
  skjemaSprak: string;
}

interface Personalia {
  personaliaKontekst: PersonaliaKontekst;
}

type MergedProps = Props &
  Personalia &
  InjectedIntlProps &
  RouteComponentProps<Routes>;

type State =
  | { status: "READY" }
  | { status: "LOADING" }
  | { status: "FETCH_COVER" }
  | { status: "MERGE" }
  | { status: "DOWNLOAD" }
  | { status: "ERROR"; error: HTTPError };
type StatusCheck = { [key in State["status"]]: any };

const LastNedPDF = (props: MergedProps) => {
  const [state, setState] = useState({ status: "READY" } as State);

  const genererPDF = async () => {
    setState({ status: "LOADING" });

    const { valgtSoknadsobjekt, relevanteVedlegg } = props;
    const { ettersendelse, klage } = props.match.params;
    const personalia = props.personaliaKontekst;
    const hovedskjema = valgtSoknadsobjekt.hovedskjema;
    const valgtLocale = props.skjemaSprak;
    const globalLocale = props.intl.locale;
    const pdfNavn = localeTekst(hovedskjema.navn, valgtLocale);

    const vedleggTilNedlasting = relevanteVedlegg
      .filter(v => !v.skalEttersendes)
      .filter(({ vedlegg }) => vedlegg.skjematilvedlegg);

    // Generer liste med pdf url-er
    // Ink. søknad og vedlegg
    const pdfListe = [] as string[];
    if (!ettersendelse) {
      pdfListe.push(hentPDFurl(hovedskjema.pdf, valgtLocale, globalLocale));
    }

    vedleggTilNedlasting.map(vedlegg =>
      pdfListe.push(
        hentPDFurl(
          vedlegg.vedlegg.skjematilvedlegg!.pdf,
          valgtLocale,
          globalLocale
        )
      )
    );

    // 1) Generer førsteside
    // 2) Merge med søknad og vedlegg
    // 3) Last ned
    setState({ status: "FETCH_COVER" });
    hentForsteside(
      relevanteVedlegg,
      personalia,
      valgtLocale,
      globalLocale,
      valgtSoknadsobjekt,
      ettersendelse,
      klage
    )
      .then(foersteside => {
        setState({ status: "MERGE" });
        return mergePDF(foersteside, pdfListe);
      })
      .then(samletPdf => {
        setState({ status: "DOWNLOAD" });
        return lastNedPDF(samletPdf, pdfNavn);
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
      <StegOverskrift steg={steg} tittel="avslutning.steg.lastned.tittel" />
      <div className="lastned__innhold">
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
        {state.status === "ERROR" && (
          <div className="lastned__feil">
            <AlertStripeStopp>
              {state.error.code} {state.error.text}
            </AlertStripeStopp>
          </div>
        )}
      </div>
    </div>
  );
};

export default injectIntl<Props & InjectedIntlProps>(
  withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>>(
    medPersonalia<Props & InjectedIntlProps & RouteComponentProps>(LastNedPDF)
  )
);
