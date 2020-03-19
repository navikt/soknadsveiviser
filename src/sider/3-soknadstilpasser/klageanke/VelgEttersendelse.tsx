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
import { settAlleVedleggSkalSendesForSoknadsobjekt } from "../../../states/reducers/vedlegg";
import {
  settEttersendTilKlage,
  settVideresendtTilEnhet
} from "../../../states/reducers/klage";
import { medValgtSoknadsobjekt } from "../../../states/providers/ValgtSoknadsobjekt";

interface Props {
  skalAnke?: boolean;
  klageSoknadsobjekt: Soknadsobjekt;
  valgtSoknadsobjekt: Soknadsobjekt;
}

interface ReduxProps {
  klageType: Klage;
  settVideresendtTilEnhet: (erVideresendt?: boolean) => void;
  settEttersendTilKlage: (skalEttersende: boolean) => void;
  settAlleVedleggSkalSendesForSoknadsobjekt: (
    soknadsobjekt: Soknadsobjekt
  ) => void;
}

type MergedProps = Props & ReduxProps & InjectedIntlProps;
const VelgEttersendelse = (props: MergedProps) => {
  const { intl, klageType, klageSoknadsobjekt, skalAnke } = props;
  const handleOnChange = (
    event: SyntheticEvent<EventTarget, Event>,
    value?: string
  ) => {
    const skalEttersende = value === "ja";
    if (skalEttersende !== undefined) {
      props.settEttersendTilKlage(skalEttersende);
      if (skalEttersende) {
        props.settAlleVedleggSkalSendesForSoknadsobjekt(klageSoknadsobjekt);
      } else {
        props.settVideresendtTilEnhet(undefined);
      }
    }
  };

  return (
    <PanelBase className="seksjon">
      <Undertittel>
        <FormattedMessage
          id={skalAnke ? "anke.ettersende" : "klage.ettersende"}
        />
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
        checked={
          klageType.skalEttersende !== undefined
            ? klageType.skalEttersende === true
              ? "ja"
              : "nei"
            : undefined
        }
        onChange={handleOnChange}
      />
    </PanelBase>
  );
};

const mapStateToProps = (store: Store) => ({
  klageType: store.klage
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  settEttersendTilKlage: (skalEttersende: boolean) =>
    dispatch(settEttersendTilKlage(skalEttersende)),
  settAlleVedleggSkalSendesForSoknadsobjekt: (soknadsobjekt: Soknadsobjekt) =>
    dispatch(settAlleVedleggSkalSendesForSoknadsobjekt(soknadsobjekt)),
  settVideresendtTilEnhet: (erVideresendt?: boolean) =>
    dispatch(settVideresendtTilEnhet(erVideresendt))
});

export default medValgtSoknadsobjekt<Props>(
  injectIntl<Props & InjectedIntlProps>(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(VelgEttersendelse)
  )
);
