import * as React from "react";
import { Knapp } from "nav-frontend-knapper";
import { FormattedMessage } from "react-intl";
import { Store } from "../../../../../typer/store";
import { Vedleggsobjekt } from "../../../../../typer/skjemaogvedlegg";
import { Soknadsobjekt } from "../../../../../typer/soknad";
import { medValgtSoknadsobjekt } from "../../../../../states/providers/ValgtSoknadsobjekt";
import { connect } from "react-redux";

interface ReduxProps {
  valgteVedlegg: Vedleggsobjekt[];
}

interface ValgtSoknad {
  valgtSoknadsobjekt: Soknadsobjekt;
  klageSoknadsobjekt?: Soknadsobjekt;
}

interface Props {
  lenke?: string;
  ettersendelse?: string;
}

type MergedProps = Props & ReduxProps & ValgtSoknad;

const Neste = (props: MergedProps) => {
  const { lenke, ettersendelse } = props;

  const relevanteVedlegg = props.valgteVedlegg
    .filter(vedlegg => vedlegg.soknadsobjektId === props.valgtSoknadsobjekt._id)
    .filter(vedlegg => !vedlegg.pakrevd);

  const vedleggSvart = relevanteVedlegg.filter(
    vedlegg => vedlegg.skalSendes !== undefined
  );

  let erDisabled = relevanteVedlegg.length !== vedleggSvart.length;

  return (
    <>
      {lenke
        ? NesteLenke(lenke, ettersendelse ? false : erDisabled)
        : NesteKnapp(erDisabled)}
    </>
  );
};

const NesteKnapp = (erDisabled: boolean) => {
  return (
    <div className="knapp__neste">
      <Knapp
        className="knapp knapp--hoved sentrert__knapp row"
        htmlType="submit"
        disabled={erDisabled}
      >
        <FormattedMessage id="personalia.knapp" />
      </Knapp>
    </div>
  );
};

export const NesteLenke = (lenke: string, erDisabled: boolean) => {
  return (
    <div className="knapp__neste">
      <Knapp
        className="knapp knapp--hoved sentrert__knapp row"
        disabled={erDisabled}
        onClick={() => window.location.href = lenke}
      >
        <FormattedMessage id="personalia.knapp" />
      </Knapp>
    </div>
  );
};

const mapStateToProps = (store: Store) => ({
  valgteVedlegg: store.vedlegg.valgteVedlegg
});

export default medValgtSoknadsobjekt<ValgtSoknad & Props>(
  connect(mapStateToProps)(Neste)
);
