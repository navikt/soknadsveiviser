import React, { SyntheticEvent } from "react";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { Vedleggsobjekt } from "typer/skjemaogvedlegg";
import { Dispatch } from "redux";
import { toggleInnsendingVedlegg } from "states/reducers/vedlegg";
import { toggleValgtVedleggForSjekkbokser } from "states/reducers/vedlegg";
import { Store } from "typer/store";
import { Soknadsobjekt } from "typer/soknad";
import { withRouter, RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import PanelBase from "nav-frontend-paneler";
import CheckboksPanelGruppe from "nav-frontend-skjema/lib/checkboks-panel-gruppe";
import { localeTekst } from "utils/sprak";
import { localeVedleggstittel } from "utils/soknadsobjekter";

interface Props {
  soknadsobjekt?: Soknadsobjekt;
  skillUtPakrevde?: boolean;
}

interface ReduxProps {
  valgteVedlegg: Vedleggsobjekt[];
  toggleValgtVedleggForSjekkbokser: (
    _key: string,
    soknadsobjektId: string
  ) => void;
  toggleInnsendingVedlegg: (_key: string, soknadsobjektId: string) => void;
}

type MergedProps = Props & InjectedIntlProps & RouteComponentProps & ReduxProps;
const Sjekkbokser = (props: MergedProps) => {
  const {
    intl,
    soknadsobjekt,
    valgteVedlegg,
    toggleValgtVedleggForSjekkbokser,
    toggleInnsendingVedlegg
  } = props;

  if (!soknadsobjekt) {
    return null;
  }

  const handleOnChange = (
    event: SyntheticEvent<EventTarget, Event>,
    value?: string
  ) => value && toggleValgtVedleggForSjekkbokser(value, soknadsobjekt._id);

  const lagCheckboks = (vedleggsobjekt: Vedleggsobjekt) => {
    const { _key } = vedleggsobjekt;

    const markert = valgteVedlegg
      .filter(v => v._key === _key)
      .filter(v => v.soknadsobjektId === soknadsobjekt._id)
      .filter(v => v.skalSendes)
      .shift();

    return {
      key: _key,
      label: localeVedleggstittel(vedleggsobjekt, intl.locale),
      value: _key,
      checked: !!markert
    };
  };

  // Dersom påkrevde vedlegg er i egen bolk
  const handleOnChangePakrevdeVedlegg = (
    event: SyntheticEvent<EventTarget, Event>,
    value?: string
  ) => {
    value && toggleInnsendingVedlegg(value, soknadsobjekt._id);
  };

  // Dersom påkrevde vedlegg er i egen bolk
  const lagEgenCheckboksForPakrevdeVedlegg = (
    vedleggsobjekt: Vedleggsobjekt
  ) => {
    const { vedlegg, _key } = vedleggsobjekt;
    const { navn } = vedlegg;
    const label = navn;

    const markert = valgteVedlegg
      .filter(v => v._key === _key)
      .filter(v => v.soknadsobjektId === soknadsobjekt._id)
      .filter(v => !v.skalEttersendes)
      .shift();

    return {
      key: _key,
      label: localeTekst(label, intl.locale),
      value: _key,
      checked: !!markert
    };
  };

  const vedleggTilSoknad = soknadsobjekt.vedleggtilsoknad || [];
  const pakrevde = vedleggTilSoknad.filter(v => v.pakrevd);
  return vedleggTilSoknad.length > 0 ? (
    <PanelBase className="seksjon">
      {props.skillUtPakrevde && pakrevde.length > 0 ? (
        <>
          <CheckboksPanelGruppe
            className="sjekkbokser__panelgruppe"
            legend={intl.formatMessage({ id: "sjekkbokser.pakrevde" })}
            checkboxes={vedleggTilSoknad
              .filter(v => v.pakrevd)
              .map(vedlegg => lagEgenCheckboksForPakrevdeVedlegg(vedlegg))}
            onChange={handleOnChangePakrevdeVedlegg}
          />
          <CheckboksPanelGruppe
            legend={intl.formatMessage({
              id: "sjekkbokser.situasjonsbestemte"
            })}
            checkboxes={vedleggTilSoknad
              .filter(v => !v.pakrevd)
              .map(vedlegg => lagCheckboks(vedlegg))}
            onChange={handleOnChange}
          />
        </>
      ) : (
        <CheckboksPanelGruppe
          legend=""
          checkboxes={vedleggTilSoknad.map(vedlegg => lagCheckboks(vedlegg))}
          onChange={handleOnChange}
        />
      )}
    </PanelBase>
  ) : null;
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

export default injectIntl<Props & InjectedIntlProps>(
  withRouter<Props & InjectedIntlProps & RouteComponentProps, any>(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Sjekkbokser)
  )
);
