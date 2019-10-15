import React, { Component } from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import { Store } from "typer/store";
import { Vedleggsobjekt } from "typer/skjemaogvedlegg";
import { Klage } from "typer/store";
import { Soknadsobjekt } from "typer/soknad";
import {
  settEttersendTilKlage,
  settVideresendtTilEnhet
} from "states/reducers/klage";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import DineVedlegg from "../felles/dinevedlegg/DineVedlegg";
import { toggleValgtVedlegg } from "states/reducers/vedlegg";
import { settAlleVedleggSkalSendesForSoknadsobjekt } from "states/reducers/vedlegg";
import VelgVedlegg from "../felles/velgvedlegg/VelgVedlegg";
import Underbanner from "komponenter/bannere/Underbanner";
import VelgEttersendelse from "./VelgEttersendelse";
import Personalia from "../felles/personalia/Personalia";
import Steg from "komponenter/bannere/Steg";
import { localeTekst } from "utils/sprak";
import { apiHentSoknadsobjektForKlage } from "klienter/sanityKlient";
import { sideTittel } from "utils/sprak";
import { medValgtSoknadsobjekt } from "states/providers/ValgtSoknadsobjekt";

interface Props {
  klageSoknadsobjekt: Soknadsobjekt;
  valgtSoknadsobjekt: Soknadsobjekt;
}

interface ReduxProps {
  klage: Klage;
  valgteVedlegg: Vedleggsobjekt[];
  hentKlageSoknadsobjekt: (skalEttersende: boolean) => void;
  settEttersendTilKlage: (skalEttersende: boolean) => void;
  settVideresendtTilEnhet: (erVideresendt: boolean) => void;
  settAlleVedleggSkalSendesForSoknadsobjekt: (
    soknadsobjekt: Soknadsobjekt
  ) => void;
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

class VisKlage extends Component<MergedProps> {
  componentDidMount = () => {
    const { klageSoknadsobjekt, match, klage } = this.props;
    const urlSkalEttersende = match.params.ettersendelse ? true : false;

    // Anke er alltid vidersendt til enhet
    this.props.settVideresendtTilEnhet(true);

    if (urlSkalEttersende && !klage.skalEttersende) {
      this.props.settEttersendTilKlage(true);
    }
    if (klageSoknadsobjekt) {
      this.props.settAlleVedleggSkalSendesForSoknadsobjekt(klageSoknadsobjekt);
    } else {
      this.props.hentKlageSoknadsobjekt(urlSkalEttersende);
    }
  };

  componentWillReceiveProps() {
    const { klageSoknadsobjekt, valgtSoknadsobjekt, intl, klage } = this.props;

    const tittelKlage = localeTekst(klageSoknadsobjekt.navn, intl.locale);
    const tittelSoknad = localeTekst(valgtSoknadsobjekt.navn, intl.locale);
    const tittelEttersendelse = klage.skalEttersende
      ? ` - ${intl.formatMessage({ id: "ettersendelser.knapp" })}`
      : "";

    if (klageSoknadsobjekt) {
      document.title = sideTittel(
        `${tittelSoknad} - ${tittelKlage} ${tittelEttersendelse}`
      );
    }
  }

  render() {
    if (!this.props.klageSoknadsobjekt) {
      return null;
    }

    const { intl, klage, match } = this.props;
    const { valgtSoknadsobjekt, klageSoknadsobjekt } = this.props;
    const { valgteVedlegg } = this.props;
    const urlSkalEttersende = match.params.ettersendelse ? true : false;

    const vedleggTilInnsending = valgteVedlegg
      .filter(v => v.soknadsobjektId === klageSoknadsobjekt._id)
      .filter(v => v.skalSendes);

    const ikkePakrevdeVedlegg = valgteVedlegg
      .filter(v => v.soknadsobjektId === klageSoknadsobjekt._id)
      .filter(v => !v.pakrevd);

    const vedleggSvart = ikkePakrevdeVedlegg.filter(
      vedlegg => vedlegg.skalSendes !== undefined
    );

    const erNesteDisabled =
      klage.erVideresendt === undefined ||
      klage.skalEttersende === undefined ||
      (!klage.skalEttersende &&
        ikkePakrevdeVedlegg.length !== vedleggSvart.length);

    const hovedskjema = valgtSoknadsobjekt.hovedskjema;
    const klageskjema = klageSoknadsobjekt.hovedskjema;
    return (
      <>
        <Underbanner
          tittel={localeTekst(klageSoknadsobjekt.navn, intl.locale)}
          undertittel={localeTekst(hovedskjema.navn, intl.locale)}
          skjemanummer={klageskjema.skjemanummer}
        />
        <Steg tittel="anke.tittel.underbanner" />
        {!urlSkalEttersende && <VelgEttersendelse />}
        {!klage.skalEttersende && (
          <VelgVedlegg soknadsobjekt={klageSoknadsobjekt} />
        )}
        <DineVedlegg
          visRadioButtons={!urlSkalEttersende && !klage.skalEttersende}
          vedleggTilInnsending={vedleggTilInnsending}
        />
        <Personalia nesteDisabled={erNesteDisabled} />
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
  settEttersendTilKlage: (skalEttersende: boolean) =>
    dispatch(settEttersendTilKlage(skalEttersende)),
  toggleValgtVedlegg: (_key: string, soknadsobjektId: string, klage: boolean) =>
    dispatch(toggleValgtVedlegg(_key, soknadsobjektId, klage)),
  settAlleVedleggSkalSendesForSoknadsobjekt: (soknadsobjekt: Soknadsobjekt) =>
    dispatch(settAlleVedleggSkalSendesForSoknadsobjekt(soknadsobjekt)),
  settVideresendtTilEnhet: (erVideresendt: boolean) =>
    dispatch(settVideresendtTilEnhet(erVideresendt))
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
