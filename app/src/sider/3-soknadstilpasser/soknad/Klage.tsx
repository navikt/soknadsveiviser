import * as React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import { Store } from "../../../typer/store";
import { Vedleggsobjekt } from "../../../typer/vedlegg";
import { Soknadsobjekt } from "../../../typer/soknad";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import DineVedlegg from "../felles/DineVedlegg";
import VelgVedlegg from "./velgvedlegg/VelgVedlegg";
import Underbanner from "../../../komponenter/bannere/Underbanner";
import Personalia from "../felles/personalia/Personalia";
import Steg from "../../../komponenter/bannere/Steg";
import { localeTekst } from "../../../utils/sprak";
import { apiHentSoknadsobjektForKlage } from "../../../klienter/sanityKlient";
import { medValgtSoknadsobjekt } from "../../../states/providers/ValgtSoknadsobjekt";

interface Props {
  klageSoknadsobjekt: Soknadsobjekt;
  valgtSoknadsobjekt: Soknadsobjekt;
}

interface ReduxProps {
  valgteVedlegg: Vedleggsobjekt[];
  hentKlageSoknadsobjekt: () => void;
}

interface Routes {
  skjemanummer: string;
  kategori: string;
  underkategori: string;
}

type MergedProps = Props &
  ReduxProps &
  RouteComponentProps<Routes> &
  InjectedIntlProps;

class Klage extends React.Component<MergedProps> {
  componentDidMount = () =>
    !this.props.klageSoknadsobjekt && this.props.hentKlageSoknadsobjekt();

  render() {
    if (!this.props.klageSoknadsobjekt) {
      return null;
    }

    const {
      valgteVedlegg,
      valgtSoknadsobjekt,
      klageSoknadsobjekt,
      intl
    } = this.props;

    const relevanteVedlegg = valgteVedlegg
      .filter(v => v.soknadsobjektId === klageSoknadsobjekt._id)
      .filter(v => v.skalSendes);

    const hovedskjema = valgtSoknadsobjekt.hovedskjema;
    const klageskjema = klageSoknadsobjekt.hovedskjema;
    return (
      <>
        <Underbanner
          tittel={localeTekst(klageSoknadsobjekt.navn, intl.locale)}
          undertittel={localeTekst(hovedskjema.navn, intl.locale)}
          skjemanummer={klageskjema.skjemanummer}
        />
        <Steg tittel="klage.tittel.underbanner" />
        <VelgVedlegg soknadsobjekt={klageSoknadsobjekt} />
        <DineVedlegg relevanteVedlegg={relevanteVedlegg} />
        <Personalia {...this.props} />
      </>
    );
  }
}

const mapStateToProps = (store: Store) => ({
  valgteVedlegg: store.vedlegg.valgteVedlegg
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  hentKlageSoknadsobjekt: () => apiHentSoknadsobjektForKlage()(dispatch)
});

export default medValgtSoknadsobjekt<Props>(
  injectIntl<Props & InjectedIntlProps>(
    withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>>(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(Klage)
    )
  )
);
