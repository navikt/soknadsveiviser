import * as React from "react";
import StegOverskrift from "./Overskrift";
import CheckboksPanelGruppe from "nav-frontend-skjema/lib/checkboks-panel-gruppe";
import { Vedleggsobjekt } from "../../../typer/skjemaogvedlegg";
import { Soknadsobjekt } from "../../../typer/soknad";
import AlertStripe from "nav-frontend-alertstriper";
import { toggleInnsendingVedlegg } from "../../../states/reducers/vedlegg";
import { medValgtSoknadsobjekt } from "../../../states/providers/ValgtSoknadsobjekt";
import {
  InjectedIntlProps,
  injectIntl,
  FormattedMessage,
  FormattedHTMLMessage
} from "react-intl";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { withRouter, RouteComponentProps } from "react-router";
import { Normaltekst } from "nav-frontend-typografi";
import { localeTekst } from "../../../utils/sprak";

interface Routes {
  ettersendelse: string;
}

interface Props {
  steg: number;
  valgtSoknadsobjekt: Soknadsobjekt;
  relevanteVedlegg: Vedleggsobjekt[];
}

interface ReduxProps {
  toggleInnsendingVedlegg: (vedleggId: string, soknadsobjektId: string) => void;
}

type MergedProps = Props &
  RouteComponentProps<Routes> &
  InjectedIntlProps &
  ReduxProps;

const Sjekkbokser = (props: MergedProps) => {
  const {
    steg,
    intl,
    relevanteVedlegg,
    toggleInnsendingVedlegg,
    valgtSoknadsobjekt
  } = props;

  const vedleggTilEttersending = relevanteVedlegg.filter(
    vedlegg => vedlegg.skalEttersendes === true
  );

  const handleOnChange = ({}, value?: string) =>
    value && toggleInnsendingVedlegg(value, valgtSoknadsobjekt._id);

  const sjekkboks = (vedleggsobjekt: Vedleggsobjekt) => {
    const { vedlegg, _key, skalEttersendes } = vedleggsobjekt;
    return {
      key: _key,
      label: `${intl.formatMessage({
        id: "avslutning.vedlegg"
      })} ${localeTekst(vedlegg.navn, intl.locale)}`,
      value: _key,
      checked: !skalEttersendes
    };
  };

  return (
    <div className="steg__rad">
      <StegOverskrift
        steg={steg}
        tittel="avslutning.steg.sjekkbokser.tittel"
        beskrivelse="avslutning.steg.sjekkbokser.beskrivelse"
      />
      <Normaltekst className="sjekkbokser__markering">
        <FormattedHTMLMessage id="avslutning.steg.sjekkbokser.markering" />
      </Normaltekst>
      <CheckboksPanelGruppe
        legend={" "}
        checkboxes={relevanteVedlegg.map(vedlegg => sjekkboks(vedlegg))}
        onChange={handleOnChange}
      />
      {vedleggTilEttersending.length > 0 && (
        <AlertStripe type="advarsel">
          <FormattedMessage id="avslutning.advarsel" />
        </AlertStripe>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  toggleInnsendingVedlegg: (vedleggId: string, soknadsobjektId: string) =>
    dispatch(toggleInnsendingVedlegg(vedleggId, soknadsobjektId))
});

export default medValgtSoknadsobjekt<Props>(
  injectIntl<Props & InjectedIntlProps>(
    withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>>(
      connect(
        undefined,
        mapDispatchToProps
      )(Sjekkbokser)
    )
  )
);
