import React, { SyntheticEvent } from "react";
import { Undertittel } from "nav-frontend-typografi";
import { Store } from "../../../typer/store";
import { Klage } from "../../../typer/store";
import { Soknadsobjekt } from "../../../typer/soknad";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import PanelBase from "nav-frontend-paneler";
import { RadioPanelGruppe } from "nav-frontend-skjema";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { settVideresendtTilEnhet } from "../../../states/reducers/klage";
import { medValgtSoknadsobjekt } from "../../../states/providers/ValgtSoknadsobjekt";

interface Props {
  klageSoknadsobjekt: Soknadsobjekt;
  valgtSoknadsobjekt: Soknadsobjekt;
}

interface ReduxProps {
  klage: Klage;
  settVideresendtTilEnhet: (erVideresendt: boolean) => void;
}

type MergedProps = Props & ReduxProps & InjectedIntlProps;
const VelgOmBehandletAvEnhet = (props: MergedProps) => {
  const { intl, klage } = props;
  const handleOnChange = (
    event: SyntheticEvent<EventTarget, Event>,
    value?: string
  ) => {
    const erVideresendt = value === "ja" ? true : false;
    if (erVideresendt !== undefined) {
      props.settVideresendtTilEnhet(erVideresendt);
    }
  };

  return (
    <PanelBase className="seksjon">
      <Undertittel>
        <FormattedMessage id="klage.videresendt.enhet" />
      </Undertittel>
      <RadioPanelGruppe
        className="vedlegg__sjekkbokser"
        key={"erVideresendtEnhet"}
        legend={""}
        name="Er videresendt enhet"
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
        checked={klage.erVideresendt ? "ja" : "nei"}
        onChange={handleOnChange}
      />
    </PanelBase>
  );
};

const mapStateToProps = (store: Store) => ({
  klage: store.klage
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  settVideresendtTilEnhet: (erVideresendt: boolean) =>
    dispatch(settVideresendtTilEnhet(erVideresendt))
});

export default medValgtSoknadsobjekt<Props>(
  injectIntl<Props & InjectedIntlProps>(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(VelgOmBehandletAvEnhet)
  )
);
