import React, { SyntheticEvent } from "react";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { Vedleggsobjekt } from "../../../../typer/skjemaogvedlegg";
import { Dispatch } from "redux";
import { toggleValgtVedleggForSjekkbokser } from "../../../../states/reducers/vedlegg";
import { Store } from "../../../../typer/store";
import { Soknadsobjekt } from "../../../../typer/soknad";
import { withRouter, RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import PanelBase from "nav-frontend-paneler";
import CheckboksPanelGruppe from "nav-frontend-skjema/lib/checkboks-panel-gruppe";
import { localeTekst } from "../../../../utils/sprak";

interface Props {
  soknadsobjekt?: Soknadsobjekt;
  hukAvPakrevde?: boolean;
}

interface ReduxProps {
  valgteVedlegg: Vedleggsobjekt[];
  toggleValgtVedleggForSjekkbokser: (
    _key: string,
    soknadsobjektId: string
  ) => void;
}

type MergedProps = Props & InjectedIntlProps & RouteComponentProps & ReduxProps;
const Sjekkbokser = (props: MergedProps) => {
  const {
    intl,
    soknadsobjekt,
    valgteVedlegg,
    toggleValgtVedleggForSjekkbokser
  } = props;

  if (!soknadsobjekt) {
    return null;
  }

  const handleOnChange = (
    event: SyntheticEvent<EventTarget, Event>,
    value?: string
  ) => value && toggleValgtVedleggForSjekkbokser(value, soknadsobjekt._id);

  const lagCheckboks = (vedleggsobjekt: Vedleggsobjekt) => {
    const { vedlegg, _key } = vedleggsobjekt;
    const { navn } = vedlegg;
    const label = navn;

    const vedleggMarkert = valgteVedlegg
      .filter(v => v._key === _key)
      .filter(v => v.soknadsobjektId === soknadsobjekt._id)
      .filter(v => v.skalSendes)
      .shift();

    return {
      key: _key,
      label: localeTekst(label, intl.locale),
      value: _key,
      checked: !!vedleggMarkert
    };
  };

  const vedleggTilSoknad = soknadsobjekt.vedleggtilsoknad || [];
  return vedleggTilSoknad.length > 0 ? (
    <PanelBase className="seksjon">
      <CheckboksPanelGruppe
        legend=""
        checkboxes={vedleggTilSoknad.map(vedlegg => lagCheckboks(vedlegg))}
        onChange={handleOnChange}
      />
    </PanelBase>
  ) : null;
};

const mapStateToProps = (store: Store) => ({
  valgteVedlegg: store.vedlegg.valgteVedlegg
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  toggleValgtVedleggForSjekkbokser: (_key: string, soknadsobjektId: string) =>
    dispatch(toggleValgtVedleggForSjekkbokser(_key, soknadsobjektId))
});

export default injectIntl<Props & InjectedIntlProps>(
  withRouter<Props & InjectedIntlProps & RouteComponentProps, any>(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Sjekkbokser)
  )
);
