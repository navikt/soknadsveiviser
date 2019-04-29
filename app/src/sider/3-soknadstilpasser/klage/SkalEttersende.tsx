import React from "react";
import { Store } from "../../../typer/store";
import { Klage } from "../../../typer/store";
import { Soknadsobjekt } from "../../../typer/soknad";
import { InjectedIntlProps, injectIntl } from "react-intl";
import PanelBase from "nav-frontend-paneler";
import { RadioPanelGruppe } from "nav-frontend-skjema";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { settEttersendTilKlage } from "../../../states/reducers/klage";
import { medValgtSoknadsobjekt } from "../../../states/providers/ValgtSoknadsobjekt";

interface Props {
  klageSoknadsobjekt: Soknadsobjekt;
  valgtSoknadsobjekt: Soknadsobjekt;
}

interface ReduxProps {
  klage: Klage;
  settEttersendTilKlage: (skalEttersende: string) => void;
}

type MergedProps = Props & ReduxProps & InjectedIntlProps;

const SkalEttersende = (props: MergedProps) => {
  const { intl, klage } = props;
  const handleOnChange = ({}, value?: string) =>
    value && props.settEttersendTilKlage(value);

  return (
    <PanelBase className="seksjon">
      <RadioPanelGruppe
        className="vedlegg__sjekkbokser"
        key={"skalEttersend"}
        legend={intl.formatMessage({ id: "klage.ettersende" })}
        name="Skal ettersende"
        radios={[
          {
            label: intl.formatMessage({ id: "velgvedlegg.ja" }),
            value: "ja"
          },
          {
            label: intl.formatMessage({ id: "velgvedlegg.nei" }),
            value: "nei"
          }
        ]}
        checked={klage.skalEttersende ? "ja" : "nei"}
        onChange={handleOnChange}
      />
    </PanelBase>
  );
};

const mapStateToProps = (store: Store) => ({
  klage: store.klage
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  settEttersendTilKlage: (skalEttersende: string) =>
    dispatch(settEttersendTilKlage(skalEttersende))
});

export default medValgtSoknadsobjekt<Props>(
  injectIntl<Props & InjectedIntlProps>(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(SkalEttersende)
  )
);
