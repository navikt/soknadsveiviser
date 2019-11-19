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
  if (props.kategorier.status !== "RESULT") {
    return null;
  }

  const { valgtKategori } = props.kategorier;
  const { soknadsobjekt, valgteVedlegg } = props;

  let label;
  let ukjentValg = 0;
  let spmNummer = 0;
  const kategoriFarge = valgtKategori
    ? valgtKategori.domenefarge
    : "@navLysGra";

  const vedleggForUtlisting = valgteVedlegg
    .filter(v => v.soknadsobjektId === soknadsobjekt._id)
    .filter(v => !v.pakrevd);

  return (
    <>
      {vedleggForUtlisting.map(vedleggsobj => {
        label = vedleggsobj.situasjon || vedleggsobj.vedlegg.navn;
        if (vedleggsobj.skalSendes === undefined) {
          // logikk for bare å vise èn og en
          ukjentValg++;
        }

        if (ukjentValg > 1) {
          return null;
        }

        return (
          <PanelBase className="seksjon vedlegg__panel" key={vedleggsobj._key}>
            <a
              href={`${window.location.href}#`}
              id={spmNummer.toString()}
              className={"vedlegg__anchor"}
            >
              Anchor
            </a>
            {vedleggForUtlisting.length > 1 && (
              <Nummer
                key={spmNummer}
                spmNummer={++spmNummer}
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
