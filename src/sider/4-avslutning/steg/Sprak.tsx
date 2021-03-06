import * as React from "react";
import StegOverskrift from "./Overskrift";
import Sprakvelger from "../../../komponenter/sprakvelger/sprakvelger";
import { Soknadsobjekt } from "../../../typer/soknad";
import {
  medPersonalia,
  Personalia
} from "../../../states/providers/Personalia";
import { Store } from "../../../typer/store";
import { connect } from "react-redux";
import { InjectedIntlProps, injectIntl} from "react-intl";

interface Props {
  steg: number;
  valgtSoknadsobjekt?: Soknadsobjekt;
  skjemaSprak: string;
  byttSprak: (sprak: string) => void;
}

const Sprak = (props: Props & InjectedIntlProps) => {
  const { steg, valgtSoknadsobjekt, byttSprak, skjemaSprak } = props;
  const { hovedskjema } = valgtSoknadsobjekt!;

  return (
    <div className="steg__rad">
      <Sprakvelger
        label={<StegOverskrift steg={steg} tittel="avslutning.sprakvelger.label" />}
        sprakvalg={hovedskjema.pdf}
        byttSprak={byttSprak}
        valgtSprak={skjemaSprak}
      />
    </div>
  );
};

const mapStateToProps = (store: Store) => ({
  valgteVedlegg: store.vedlegg.valgteVedlegg
});

export default medPersonalia<Props & Personalia>(
  injectIntl<Props & Personalia & InjectedIntlProps>(
  connect(mapStateToProps)(Sprak))
);
