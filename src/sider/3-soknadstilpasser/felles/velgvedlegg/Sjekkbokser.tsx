import React, {SyntheticEvent} from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {Vedleggsobjekt} from "typer/skjemaogvedlegg";
import {Dispatch} from "redux";
import {toggleInnsendingVedlegg, toggleValgtVedleggForSjekkbokser} from "states/reducers/vedlegg";
import {Store} from "typer/store";
import {Soknadsobjekt} from "typer/soknad";
import {RouteComponentProps, withRouter} from "react-router";
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
  toggleInnsendingVedlegg: ToggleFunc;
}

const sjekkboksPanelPropsForVedlegg = (vedleggsobjekt: Vedleggsobjekt, locale: string, markert: boolean) => {
  return {
    key: vedleggsobjekt._key,
    label: localeVedleggstittel(vedleggsobjekt, locale),
    value: vedleggsobjekt._key,
    checked: markert
  };
}

const createVedleggsContext = (valgteVedlegg: Vedleggsobjekt[], soknadsobjekt: Soknadsobjekt, locale: string) => {
  const result = {
    createChangeHandler: (toggleFunc: ToggleFunc) => {
      return (
        event: SyntheticEvent<EventTarget, Event>,
        value?: string
      ) => value && toggleFunc(value, soknadsobjekt._id);
    },
    paakrevdeVedlegg: () => {
      return result.vedleggTilSoknad().filter(v => v.pakrevd);
    },
    ikkePaakrevdeVedlegg: () => {
      return result.vedleggTilSoknad().filter(v => !v.pakrevd);
    },
    vedleggTilSoknad: () => {
      return soknadsobjekt.vedleggtilsoknad || [];
    },
    manglerVedlegg: () => {
      if (result.vedleggTilSoknad().length < 1) {
        return null;
      }
    },
    skalVedleggetSendes: (vedleggsobjekt: Vedleggsobjekt) => {
      return !!(valgteVedlegg
        .filter(v => v._key === vedleggsobjekt._key)
        .filter(v => v.soknadsobjektId === soknadsobjekt._id)
        .filter(v => v.skalSendes)
        .shift());
    },
    skalVedleggetIkkeEttersendes: (vedleggsobjekt: Vedleggsobjekt) => {
      return !!(valgteVedlegg
        .filter(v => v._key === vedleggsobjekt._key)
        .filter(v => v.soknadsobjektId === soknadsobjekt._id)
        .filter(v => !v.skalEttersendes)
        .shift());
    },
    lagCheckboksForVedlegg: (vedleggsobjekt: Vedleggsobjekt) => {
      return sjekkboksPanelPropsForVedlegg(
        vedleggsobjekt,
        locale,
        result.skalVedleggetSendes(vedleggsobjekt));
    },
    // påkrevde vedlegg i egen bolk
    lagEgenCheckboksForPakrevdeVedlegg: (vedleggsobjekt: Vedleggsobjekt) => {
      return sjekkboksPanelPropsForVedlegg(
        vedleggsobjekt,
        locale,
        result.skalVedleggetIkkeEttersendes(vedleggsobjekt));
    }
  }
  return result;
}


type MergedProps = Props & InjectedIntlProps & RouteComponentProps & ReduxProps;
const Sjekkbokser = ({
                       intl,
                       soknadsobjekt,
                       valgteVedlegg,
                       toggleValgtVedleggForSjekkbokser,
                     }: MergedProps) => {
  const vedleggsContext = createVedleggsContext(valgteVedlegg, soknadsobjekt, intl.locale);
  if (vedleggsContext.manglerVedlegg()) {
    return null;
  }
  return (
    <PanelBase className="seksjon">
      <CheckboksPanelGruppe
        legend=""
        checkboxes={vedleggsContext.vedleggTilSoknad().map(vedleggsContext.lagCheckboksForVedlegg)}
        onChange={vedleggsContext.createChangeHandler(toggleValgtVedleggForSjekkbokser)}
      />
    </PanelBase>
  );
};

const SjekkbokserMedUtskiltePaakrevde = (props: MergedProps) => {
  const {
    intl,
    soknadsobjekt,
    valgteVedlegg,
    toggleValgtVedleggForSjekkbokser,
    toggleInnsendingVedlegg
  } = props;
  const vedleggsContext = createVedleggsContext(valgteVedlegg, soknadsobjekt, intl.locale);
  if (vedleggsContext.manglerVedlegg()) {
    return null;
  }
  if (vedleggsContext.paakrevdeVedlegg().length < 1) {
    return <Sjekkbokser {...props} />;
  }
  return (
    <PanelBase className="seksjon">
      <CheckboksPanelGruppe
        className="sjekkbokser__panelgruppe"
        legend={intl.formatMessage({id: "sjekkbokser.pakrevde"})}
        checkboxes={vedleggsContext.paakrevdeVedlegg()
          .map(vedleggsContext.lagEgenCheckboksForPakrevdeVedlegg)}
        onChange={vedleggsContext.createChangeHandler(toggleInnsendingVedlegg)}
      />
      <CheckboksPanelGruppe
        legend={intl.formatMessage({
          id: "sjekkbokser.situasjonsbestemte"
        })}
        checkboxes={vedleggsContext.ikkePaakrevdeVedlegg()
          .map(vedleggsContext.lagCheckboksForVedlegg)}
        onChange={vedleggsContext.createChangeHandler(toggleValgtVedleggForSjekkbokser)}
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

