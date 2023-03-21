import React, { Component } from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import { Klage, Store } from "typer/store";
import { Vedleggsobjekt } from "typer/skjemaogvedlegg";
import { Soknadsobjekt } from "typer/soknad";
import { settEttersendTilKlage } from "states/reducers/klage";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import DineVedlegg from "../felles/dinevedlegg/DineVedlegg";
import { settAlleVedleggSkalSendesForSoknadsobjekt, toggleValgtVedlegg } from "states/reducers/vedlegg";
import VelgOmBehandletAvEnhet from "./VelgOmBehandletAvEnhet";
import VelgVedlegg from "../felles/velgvedlegg/VeiledendeVedleggsvalg";
import Underbanner from "komponenter/bannere/Underbanner";
import VelgEttersendelse from "./VelgEttersendelse";
import Personalia from "../felles/personalia/Personalia";
import Steg from "komponenter/bannere/Steg";
import { localeTekst, sideTittel } from "utils/sprak";
import { apiHentSoknadsobjektForKlage } from "klienter/sanityKlient";
import { medValgtSoknadsobjekt } from "states/providers/ValgtSoknadsobjekt";
import { kanKlage } from "../../../utils/kanKlage";
import Helmet from "react-helmet";

interface Props {
  klageSoknadsobjekt: Soknadsobjekt;
  valgtSoknadsobjekt: Soknadsobjekt;
}

interface ReduxProps {
  klage: Klage;
  valgteVedlegg: Vedleggsobjekt[];
  hentKlageSoknadsobjekt: (skalEttersende: boolean) => void;
  settEttersendTilKlage: (skalEttersende: boolean) => void;
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
  personEllerBedrift: string;
}

type MergedProps = Props &
  ReduxProps &
  RouteComponentProps<Routes> &
  InjectedIntlProps;

class VisKlage extends Component<MergedProps> {
  componentDidMount = () => {
    const { klageSoknadsobjekt, klage, match } = this.props;

    const urlSkalEttersende = !!match.params.ettersendelse;
    if (urlSkalEttersende && !klage.skalEttersende) {
      this.props.settEttersendTilKlage(true);
    }
    if (klageSoknadsobjekt) {
      this.props.settAlleVedleggSkalSendesForSoknadsobjekt(klageSoknadsobjekt);
    } else {
      this.props.hentKlageSoknadsobjekt(urlSkalEttersende);
    }
  };

  private kalkulerTitleTag() {
    const { valgtSoknadsobjekt, klageSoknadsobjekt, klage, intl } = this.props;
    const tittelKlage = localeTekst(klageSoknadsobjekt.navn, intl.locale);
    const tittelSoknad = localeTekst(valgtSoknadsobjekt.navn, intl.locale);
    const tittelEttersendelse = klage.skalEttersende
      ? ` - ${intl.formatMessage({ id: "ettersendelser.knapp" })}`
      : "";
    return sideTittel(
      `${tittelSoknad} - ${tittelKlage} ${tittelEttersendelse}`
    );
  }

  render() {
    const { intl, klage, match } = this.props;
    const { valgtSoknadsobjekt, klageSoknadsobjekt } = this.props;
    const { valgteVedlegg } = this.props;

    if (
      !klageSoknadsobjekt ||
      !kanKlage(valgtSoknadsobjekt.klageAnke, match.params.personEllerBedrift)
    ) {
      return null;
    }

    const urlSkalEttersende = !!match.params.ettersendelse;
    const valgtSkalEttersende = klage.skalEttersende;
    const vedleggTilInnsending = valgteVedlegg
      .filter(v => v.soknadsobjektId === klageSoknadsobjekt._id)
      .filter(v => v.skalSendes);

    const ikkePakrevdeVedlegg = valgteVedlegg
      .filter(v => v.soknadsobjektId === klageSoknadsobjekt._id)
      .filter(v => !v.pakrevd);

    const vedleggSvart = ikkePakrevdeVedlegg.filter(
      vedlegg => vedlegg.skalSendes !== undefined
    );

    const klageskjema = klageSoknadsobjekt.hovedskjema;

    const erNesteDisabled =
      valgtSkalEttersende === undefined ||
      (valgtSkalEttersende && klage.erVideresendt === undefined) ||
      (!valgtSkalEttersende &&
        ikkePakrevdeVedlegg.length !== vedleggSvart.length);
    const title = this.kalkulerTitleTag();
    return (
      <>
        <Helmet>
          <title>{title}</title>
          <meta name="robots" content="noindex"/>
        </Helmet>
        <Underbanner
          tittel={localeTekst(klageSoknadsobjekt.navn, intl.locale)}
          skjemanummer={klageskjema.skjemanummer}
        />
        {urlSkalEttersende || (!urlSkalEttersende && valgtSkalEttersende) ? (
          <Steg tittel="klage.ettersendelse.tittel.underbanner"/>
        ) : (
          <Steg tittel="klage.tittel.underbanner"/>
        )}
        {!urlSkalEttersende && <VelgEttersendelse/>}
        {(urlSkalEttersende || (!urlSkalEttersende && valgtSkalEttersende)) && (
          <VelgOmBehandletAvEnhet/>
        )}
        {klage.skalEttersende !== undefined && !valgtSkalEttersende && (
          <VelgVedlegg soknadsobjekt={klageSoknadsobjekt}/>
        )}
        <DineVedlegg
          visRadioButtons={!urlSkalEttersende && !valgtSkalEttersende}
          vedleggTilInnsending={vedleggTilInnsending}
        />
        <Personalia
          skalKlage={true}
          typeKlage={klage}
          nesteDisabled={erNesteDisabled}
        />
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
    dispatch(settAlleVedleggSkalSendesForSoknadsobjekt(soknadsobjekt))
});

export default medValgtSoknadsobjekt<Props>(
  injectIntl<Props & InjectedIntlProps>(
    withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>, any>(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(VisKlage)
    )
  )
);
