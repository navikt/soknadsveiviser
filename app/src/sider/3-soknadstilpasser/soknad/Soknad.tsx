import React, { Component } from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import { localeTekst } from "../../../utils/sprak";
import { Store, FetchSoknad } from "../../../typer/store";
import { Vedleggsobjekt } from "../../../typer/vedlegg";
import { connect } from "react-redux";
import { Soknadsobjekt } from "../../../typer/soknad";
import DineVedlegg from "../felles/DineVedlegg";
import VelgVedlegg from "../felles/velgvedlegg/VelgVedlegg";
import Underbanner from "../../../komponenter/bannere/Underbanner";
import Personalia from "../felles/personalia/Personalia";
import Steg from "../../../komponenter/bannere/Steg";
import { medValgtSoknadsobjekt } from "../../../states/providers/ValgtSoknadsobjekt";

interface Props {
  valgtSoknadsobjekt: Soknadsobjekt;
}

interface Routes {
  skjemanummer: string;
  kategori: string;
  underkategori: string;
}

interface ReduxProps {
  valgteVedlegg: Vedleggsobjekt[];
  soknad: FetchSoknad;
  hentSoknadsobjekt: (
    kategori: string,
    underkategori: string,
    skjemanummer: string
  ) => void;
}

type MergedProps = Props &
  ReduxProps &
  RouteComponentProps<Routes> &
  InjectedIntlProps;

class PapirSoknad extends Component<MergedProps> {
  render() {
    const { intl } = this.props;
    const { valgteVedlegg, valgtSoknadsobjekt } = this.props;

    const relevanteVedlegg = valgteVedlegg
      .filter(v => v.soknadsobjektId === valgtSoknadsobjekt._id)
      .filter(v => v.skalSendes || v.pakrevd);

    const { hovedskjema } = valgtSoknadsobjekt;

    return (
      <>
        <Underbanner
          tittel={localeTekst(valgtSoknadsobjekt.navn, intl.locale)}
          undertittel={localeTekst(hovedskjema.navn, intl.locale)}
          skjemanummer={hovedskjema.skjemanummer}
        />
        <Steg
          tittel="velgvedlegg.informasjonspanel.tittel"
          ingress="velgvedlegg.informasjonspanel.ingress"
          beskrivelse="velgvedlegg.informasjonspanel.beskrivelse"
        />
        <VelgVedlegg soknadsobjekt={valgtSoknadsobjekt} />
        <DineVedlegg relevanteVedlegg={relevanteVedlegg} />
        <Personalia />
      </>
    );
  }
}

const mapStateToProps = (store: Store) => ({
  valgteVedlegg: store.vedlegg.valgteVedlegg
});

export default medValgtSoknadsobjekt<Props>(
  injectIntl<Props & InjectedIntlProps>(
    withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>>(
      connect(mapStateToProps)(PapirSoknad)
    )
  )
);
