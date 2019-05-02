import React from "react";
import { Undertittel } from "nav-frontend-typografi";
import { Store } from "../../../typer/store";
import { Klage } from "../../../typer/store";
import { Soknadsobjekt } from "../../../typer/soknad";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import PanelBase from "nav-frontend-paneler";
import { RadioPanelGruppe } from "nav-frontend-skjema";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { settAlleVedleggSkalSendesForSoknadsobjekt } from "../../../states/reducers/vedlegg";
import { settEttersendTilKlage } from "../../../states/reducers/klage";
import { medValgtSoknadsobjekt } from "../../../states/providers/ValgtSoknadsobjekt";

interface Props {
  klageSoknadsobjekt: Soknadsobjekt;
  valgtSoknadsobjekt: Soknadsobjekt;
}

interface ReduxProps {
  klage: Klage;
  settEttersendTilKlage: (skalEttersende: boolean) => void;
  settAlleVedleggSkalSendesForSoknadsobjekt: (
    soknadsobjekt: Soknadsobjekt
  ) => void;
}

type MergedProps = Props & ReduxProps & InjectedIntlProps;
const VelgEttersendelse = (props: MergedProps) => {
  const { intl, klage, klageSoknadsobjekt } = props;
  const handleOnChange = ({}, value?: string) => {
    const skalEttersende = value === "ja" ? true : false;
    if (skalEttersende !== undefined) {
      props.settEttersendTilKlage(skalEttersende);
      if (skalEttersende) {
        props.settAlleVedleggSkalSendesForSoknadsobjekt(klageSoknadsobjekt);
      }
    }
  };

  return (
    <PanelBase className="seksjon">
      <Undertittel>
        <FormattedMessage id="klage.ettersende" />
      </Undertittel>
      <RadioPanelGruppe
        className="vedlegg__sjekkbokser"
        key={"skalEttersend"}
        legend={""}
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
  settEttersendTilKlage: (skalEttersende: boolean) =>
    dispatch(settEttersendTilKlage(skalEttersende)),
  settAlleVedleggSkalSendesForSoknadsobjekt: (soknadsobjekt: Soknadsobjekt) =>
    dispatch(settAlleVedleggSkalSendesForSoknadsobjekt(soknadsobjekt))
});

export default medValgtSoknadsobjekt<Props>(
  injectIntl<Props & InjectedIntlProps>(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(VelgEttersendelse)
  )
);
