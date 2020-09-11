import React, {SyntheticEvent} from "react";
import {injectIntl, InjectedIntlProps} from "react-intl";
import {Vedleggsobjekt} from "typer/skjemaogvedlegg";
import {Dispatch} from "redux";
import {toggleInnsendingVedlegg} from "states/reducers/vedlegg";
import {toggleValgtVedleggForSjekkbokser} from "states/reducers/vedlegg";
import {Store} from "typer/store";
import {Soknadsobjekt} from "typer/soknad";
import {withRouter, RouteComponentProps} from "react-router";
import {connect} from "react-redux";
import PanelBase from "nav-frontend-paneler";
import CheckboksPanelGruppe from "nav-frontend-skjema/lib/checkboks-panel-gruppe";
import {localeVedleggstittel} from "utils/soknadsobjekter";

interface Props {
  soknadsobjekt: Soknadsobjekt;
}

type ToggleFunc = (_key: string, soknadsobjektId: string) => void;

interface ReduxProps {
  valgteVedlegg: Vedleggsobjekt[];
  toggleValgtVedleggForSjekkbokser: ToggleFunc;
  toggleInnsendingVedlegg: (_key: string, soknadsobjektId: string) => void;
}

const sjekkboksPanelPropsForVedlegg = (vedleggsobjekt: Vedleggsobjekt, locale: string, markert: boolean) => {
  return {
    key: vedleggsobjekt._key,
    label: localeVedleggstittel(vedleggsobjekt, locale),
    value: vedleggsobjekt._key,
    checked: markert
  };
}

const createChangeHandler = (toggleFunc: ToggleFunc, soknadsobjekt: Soknadsobjekt) => {
  return (
    event: SyntheticEvent<EventTarget, Event>,
    value?: string
  ) => value && toggleFunc(value, soknadsobjekt._id);
}

const lagCheckboks = (vedleggsobjekt: Vedleggsobjekt, valgteVedlegg: Vedleggsobjekt[], soknadsobjekt: Soknadsobjekt, locale: string) => {
  const markert = valgteVedlegg
    .filter(v => v._key === vedleggsobjekt._key)
    .filter(v => v.soknadsobjektId === soknadsobjekt._id)
    .filter(v => v.skalSendes)
    .shift();
  return sjekkboksPanelPropsForVedlegg(vedleggsobjekt, locale, !!markert);
};

const skalSendes = (vedleggsobjekt: Vedleggsobjekt, valgteVedlegg: Vedleggsobjekt[], soknadsobjekt: Soknadsobjekt) => {
  const markert = valgteVedlegg
    .filter(v => v._key === vedleggsobjekt._key)
    .filter(v => v.soknadsobjektId === soknadsobjekt._id)
    .filter(v => v.skalSendes)
    .shift();
  return !!markert;
}


type MergedProps = Props & InjectedIntlProps & RouteComponentProps & ReduxProps;
const Sjekkbokser = ({
                       intl,
                       soknadsobjekt,
                       valgteVedlegg,
                       toggleValgtVedleggForSjekkbokser,
                     }: MergedProps) => {
  const vedleggTilSoknad = soknadsobjekt.vedleggtilsoknad || [];
  if (vedleggTilSoknad.length < 1) {
    return null;
  }
  return (
    <PanelBase className="seksjon">
      <CheckboksPanelGruppe
        legend=""
        checkboxes={vedleggTilSoknad.map(vedlegg => sjekkboksPanelPropsForVedlegg(
          vedlegg,
          intl.locale,
          skalSendes(vedlegg, valgteVedlegg, soknadsobjekt)))}
        onChange={createChangeHandler(toggleValgtVedleggForSjekkbokser, soknadsobjekt)}
      />
    </PanelBase>
  );
};

const mapStateToProps = (store: Store) => ({
  valgteVedlegg: store.vedlegg.valgteVedlegg
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  toggleValgtVedleggForSjekkbokser: (_key: string, soknadsobjektId: string) =>
    dispatch(toggleValgtVedleggForSjekkbokser(_key, soknadsobjektId)),
  toggleInnsendingVedlegg: (_key: string, soknadsobjektId: string) =>
    dispatch(toggleInnsendingVedlegg(_key, soknadsobjektId))
});

const SjekkbokserMedUtskiltePaakrevde = (props: MergedProps) => {
  const {
    intl,
    soknadsobjekt,
    valgteVedlegg,
    toggleValgtVedleggForSjekkbokser,
    toggleInnsendingVedlegg
  } = props;
  const vedleggTilSoknad = soknadsobjekt.vedleggtilsoknad || [];
  if (vedleggTilSoknad.length < 1) {
    return null;
  }
  const pakrevde = vedleggTilSoknad.filter(v => v.pakrevd);
  if (pakrevde.length < 1) {
    return <Sjekkbokser {...props} />;
  }
  // Dersom påkrevde vedlegg er i egen bolk
  const lagEgenCheckboksForPakrevdeVedlegg = (
    vedleggsobjekt: Vedleggsobjekt
  ) => {
    const markert = valgteVedlegg
      .filter(v => v._key === vedleggsobjekt._key)
      .filter(v => v.soknadsobjektId === soknadsobjekt._id)
      .filter(v => !v.skalEttersendes)
      .shift();
    return sjekkboksPanelPropsForVedlegg(vedleggsobjekt, intl.locale, !!markert);
  };

  return (
    <PanelBase className="seksjon">
      <CheckboksPanelGruppe
        className="sjekkbokser__panelgruppe"
        legend={intl.formatMessage({id: "sjekkbokser.pakrevde"})}
        checkboxes={vedleggTilSoknad
          .filter(v => v.pakrevd)
          .map(vedlegg => lagEgenCheckboksForPakrevdeVedlegg(vedlegg))}
        onChange={createChangeHandler(toggleInnsendingVedlegg, soknadsobjekt)}
      />
      <CheckboksPanelGruppe
        legend={intl.formatMessage({
          id: "sjekkbokser.situasjonsbestemte"
        })}
        checkboxes={vedleggTilSoknad
          .filter(v => !v.pakrevd)
          .map(vedlegg => lagCheckboks(vedlegg, valgteVedlegg, soknadsobjekt, intl.locale))}
        onChange={createChangeHandler(toggleValgtVedleggForSjekkbokser, soknadsobjekt)}
      />
    </PanelBase>
  );
};


const WrappedSjekkBokserMedUtskiltePaakrevde = injectIntl<Props & InjectedIntlProps>(
  withRouter<Props & InjectedIntlProps & RouteComponentProps, any>(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(SjekkbokserMedUtskiltePaakrevde)
  )
);

const WrappedSjekkbokser = injectIntl<Props & InjectedIntlProps>(
  withRouter<Props & InjectedIntlProps & RouteComponentProps, any>(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Sjekkbokser)
  )
)

export {WrappedSjekkBokserMedUtskiltePaakrevde as SjekkbokserMedUtskiltePaakrevde, WrappedSjekkbokser as Sjekkbokser};

