import * as React from "react";
import { Knapp } from "nav-frontend-knapper";
import { FormattedMessage } from "react-intl";
import { Store } from "../../../../../typer/store";
import { Vedleggsobjekt } from "../../../../../typer/vedlegg";
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

type MergedProps = ReduxProps & ValgtSoknad;
const NesteKnapp = (props: MergedProps) => {
  const relevanteVedlegg = props.valgteVedlegg
    .filter(vedlegg => vedlegg.soknadsobjektId == props.valgtSoknadsobjekt._id)
    .filter(vedlegg => !vedlegg.pakrevd);

  const vedleggSvart = relevanteVedlegg.filter(
    vedlegg => vedlegg.skalSendes !== undefined
  );

  return (
    <div className="knapp__neste">
      <Knapp
        className="knapp knapp--hoved sentrert__knapp row"
        htmlType="submit"
        disabled={relevanteVedlegg.length !== vedleggSvart.length}
      >
        <FormattedMessage id="personalia.knapp" />
      </Knapp>
    </div>
  );
};

const mapStateToProps = (store: Store) => ({
  valgteVedlegg: store.vedlegg.valgteVedlegg
});

export default medValgtSoknadsobjekt<ValgtSoknad>(
  connect(mapStateToProps)(NesteKnapp)
);
