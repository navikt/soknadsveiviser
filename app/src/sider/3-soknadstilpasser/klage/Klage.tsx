import * as React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import { Store } from "../../../typer/store";
import { Vedleggsobjekt } from "../../../typer/vedlegg";
import { Klage } from "../../../typer/store";
import { Soknadsobjekt } from "../../../typer/soknad";
import { settEttersendTilKlage } from "../../../states/reducers/klage";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import DineVedlegg from "../felles/DineVedlegg";
import {
  toggleValgtVedlegg,
  settVedleggSkalSendesForSoknadsobjekt
} from "../../../states/reducers/vedlegg";
import VelgVedlegg from "../felles/velgvedlegg/VelgVedlegg";
import Underbanner from "../../../komponenter/bannere/Underbanner";
import SkalEttersende from "./SkalEttersende";
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
  klage: Klage;
  valgteVedlegg: Vedleggsobjekt[];
  hentKlageSoknadsobjekt: (skalEttersende: boolean) => void;
  settEttersendTilKlage: (skalEttersende: string) => void;
  settVedleggSkalSendesForSoknadsobjekt: (soknadsobjekt: Soknadsobjekt) => void;
  toggleValgtVedlegg?: (
    _key: string,
    soknadsobjektId: string,
    klage: boolean
  ) => void;
}

interface Routes {
  ettersendelse: string;
  skjemanummer: string;
  kategori: string;
  underkategori: string;
}

type MergedProps = Props &
  ReduxProps &
  RouteComponentProps<Routes> &
  InjectedIntlProps;

class VisKlage extends React.Component<MergedProps> {
  componentDidMount = () => {
    const { klageSoknadsobjekt, match, klage } = this.props;
    if (match.params.ettersendelse && !klage.skalEttersende) {
      this.props.settEttersendTilKlage("ja");
    }
    if (!klageSoknadsobjekt) {
      this.props.hentKlageSoknadsobjekt(klage.skalEttersende);
    } else {
      this.props.settVedleggSkalSendesForSoknadsobjekt(klageSoknadsobjekt);
    }
  };

  render() {
    if (!this.props.klageSoknadsobjekt) {
      return null;
    }

    const {
      valgteVedlegg,
      valgtSoknadsobjekt,
      klageSoknadsobjekt,
      intl,
      klage,
      match
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
        {!match.params.ettersendelse && <SkalEttersende />}
        {!klage.skalEttersende && (
          <VelgVedlegg soknadsobjekt={klageSoknadsobjekt} />
        )}
        <DineVedlegg relevanteVedlegg={relevanteVedlegg} />
        <Personalia {...this.props} />
      </>
    );
  }
}

const mapStateToProps = (store: Store) => ({
  klage: store.klage,
  valgteVedlegg: store.vedlegg.valgteVedlegg
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  hentKlageSoknadsobjekt: (skalEttersende: boolean) =>
    apiHentSoknadsobjektForKlage(skalEttersende)(dispatch),
  settEttersendTilKlage: (skalEttersende: string) =>
    dispatch(settEttersendTilKlage(skalEttersende)),
  toggleValgtVedlegg: (_key: string, soknadsobjektId: string, klage: boolean) =>
    dispatch(toggleValgtVedlegg(_key, soknadsobjektId, klage)),
  settVedleggSkalSendesForSoknadsobjekt: (soknadsobjekt: Soknadsobjekt) =>
    dispatch(settVedleggSkalSendesForSoknadsobjekt(soknadsobjekt))
});

export default medValgtSoknadsobjekt<Props>(
  injectIntl<Props & InjectedIntlProps>(
    withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>>(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(VisKlage)
    )
  )
);
