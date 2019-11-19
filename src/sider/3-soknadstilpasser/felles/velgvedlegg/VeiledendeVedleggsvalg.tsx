import * as React from "react";
import { Vedleggsobjekt } from "../../../../typer/skjemaogvedlegg";
import { Store } from "../../../../typer/store";
import { Soknadsobjekt } from "../../../../typer/soknad";
import { withRouter, RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import PanelBase from "nav-frontend-paneler";
import { FetchKategorier } from "../../../../typer/store";
import Nummer from "./Nummer";
import Sporsmal from "./Sporsmal";
import { useEffect } from "react";

interface Routes {
  klage: string;
}

interface Props {
  soknadsobjekt: Soknadsobjekt;
}

interface ReduxProps {
  kategorier: FetchKategorier;
  valgteVedlegg: Vedleggsobjekt[];
}

type MergedProps = Props & RouteComponentProps<Routes> & ReduxProps;
const VeiledendeVedleggsvalg = (props: MergedProps) => {
  const { history } = props;
  const { location } = history;
  const { soknadsobjekt, valgteVedlegg } = props;

  const relevanteVedlegg = valgteVedlegg.filter(
    v => v.soknadsobjektId === soknadsobjekt._id
  );

  useEffect(() => {
    if (location.hash) {
      // Kun scroll til neste spørsmål dersom det ikke er besvart
      const nesteSpmHash = document.getElementById(location.hash);
      const nesteSpmInt = parseInt(location.hash.split("#")[1], 10);
      const nesteEksisterer = nesteSpmInt < relevanteVedlegg.length;

      if (nesteSpmHash && nesteEksisterer) {
        const nesteSpmErUbesvart =
          relevanteVedlegg[nesteSpmInt].skalSendes === undefined;

        // Scroll
        if (nesteSpmErUbesvart) {
          nesteSpmHash.scrollIntoView({
            behavior: "smooth"
          });
        }
      }
    }
  }, [location.hash, relevanteVedlegg]);

  if (props.kategorier.status !== "RESULT") {
    return null;
  }

  let label;
  let ukjentValg = 0;
  let spmNummer = 0;
  const { valgtKategori } = props.kategorier;
  const vedleggForUtlisting = relevanteVedlegg.filter(v => !v.pakrevd);
  const kategoriFarge = valgtKategori
    ? valgtKategori.domenefarge
    : "@navLysGra";

  return (
    <>
      {vedleggForUtlisting.map(vedleggsobj => {
        label = vedleggsobj.situasjon || vedleggsobj.vedlegg.navn;
        spmNummer++;

        if (vedleggsobj.skalSendes === undefined) {
          // logikk for bare å vise èn og en
          ukjentValg++;
        }

        if (ukjentValg > 1) {
          return null;
        }

        return (
          <PanelBase className="seksjon vedlegg__panel" key={vedleggsobj._key}>
            <div
              className={"vedlegg__anchor"}
              id={`#${spmNummer.toString()}`}
            />
            {vedleggForUtlisting.length > 1 && (
              <Nummer
                key={spmNummer}
                spmNummer={spmNummer}
                kategoriFarge={kategoriFarge}
                antallSpm={vedleggForUtlisting.length}
              />
            )}
            <Sporsmal
              spmNummer={spmNummer}
              label={label}
              vedleggsobj={vedleggsobj}
            />
          </PanelBase>
        );
      })}
    </>
  );
};

const mapStateToProps = (store: Store) => ({
  valgteVedlegg: store.vedlegg.valgteVedlegg,
  kategorier: store.kategorier
});

export default withRouter<Props & RouteComponentProps<Routes>, any>(
  connect(mapStateToProps)(VeiledendeVedleggsvalg)
);
