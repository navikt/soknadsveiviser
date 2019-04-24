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
import { mergePDF, lastNedPDF, hentPDFurl, lastNedFil } from "./utils/pdf";
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

const LastNed = (props: MergedProps) => {
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

    const skjemaTilNedlasting = vedleggTilNedlasting
      .map(({ vedlegg }) => vedlegg)
      .map(({ skjematilvedlegg }) => skjematilvedlegg!);

    // Generer liste med pdf url-er
    // Ink. søknad og vedlegg
    const pdfListe = [] as string[];
    const docListe = [] as { url: string; tittel: string; filtype: string }[];

    if (!ettersendelse) {
      pdfListe.push(hentPDFurl(hovedskjema.pdf, valgtLocale, globalLocale));
    }

    //Legg pdf-er i egen liste
    skjemaTilNedlasting
      .map(({ pdf }) => hentPDFurl(pdf, valgtLocale, globalLocale))
      .filter(url => url.split(".").pop() === "pdf")
      .map(url => pdfListe.push(url));

    //Andre vedlegg som ikke er pdf
    skjemaTilNedlasting
      .map(skjema => {
        const url = hentPDFurl(skjema.pdf, valgtLocale, globalLocale);
        const filType = url.split(".").pop() || "pdf";
        return {
          url: url,
          tittel: localeTekst(skjema.navn, valgtLocale),
          filtype: filType
        };
      })
      .filter(fil => fil.filtype !== "pdf")
      .map(fil => docListe.push(fil));

    // 1) Generer førsteside
    // 2) Merge med søknad og vedlegg som er pdf-er
    // 3) Last ned sammenslått pdf
    // 4) Last ned andre vedlegg
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
      .then(() =>
        docListe.map(fil => lastNedFil(fil.url, fil.tittel, fil.filtype))
      )
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
    medPersonalia<Props & InjectedIntlProps & RouteComponentProps>(LastNed)
  )
);
