import React, { Component, SyntheticEvent } from "react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import { localeTekst } from "../../../utils/sprak";
import { Store } from "../../../typer/store";
import { Vedleggsobjekt } from "../../../typer/skjemaogvedlegg";
import { connect } from "react-redux";
import { Soknadsobjekt } from "../../../typer/soknad";
import DineVedlegg from "../felles/dinevedlegg/DineVedlegg";
import VeiledendeVedleggsvalg from "../felles/velgvedlegg/VeiledendeVedleggsvalg";
import Underbanner from "../../../komponenter/bannere/Underbanner";
import Personalia from "../felles/personalia/Personalia";
import Steg from "../../../komponenter/bannere/Steg";
import { medValgtSoknadsobjekt } from "../../../states/providers/ValgtSoknadsobjekt";
import { sideTittel } from "../../../utils/sprak";
import Sjekkbokser from "../felles/velgvedlegg/Sjekkbokser";
import AlertStripe from "nav-frontend-alertstriper";
import { ToggleGruppe, ToggleKnappPureProps } from "nav-frontend-toggle";

interface Props {
  valgtSoknadsobjekt: Soknadsobjekt;
}

interface Routes {
  skjemanummer: string;
  kategori: string;
  underkategori: string;
}

interface ReduxProps {
  valgteVedlegg: Vedleggsobjekt[];
}

type MergedProps = Props &
  ReduxProps &
  RouteComponentProps<Routes> &
  InjectedIntlProps;

class PapirSoknad extends Component<MergedProps, { veiledning: boolean }> {
  constructor(props: MergedProps) {
    super(props);
    this.state = { veiledning: true };
  }

  onClick = (
    event: SyntheticEvent<EventTarget>,
    toggles: ToggleKnappPureProps[]
  ) => {
    this.state.veiledning !== toggles[0].pressed &&
      this.setState({ veiledning: !this.state.veiledning });
  };

  render() {
    const { intl } = this.props;
    const { valgteVedlegg, valgtSoknadsobjekt } = this.props;
    const { hovedskjema } = valgtSoknadsobjekt;

    document.title = sideTittel(
      `${localeTekst(
        valgtSoknadsobjekt.navn,
        intl.locale
      )}  - ${intl.formatMessage({
        id: "tittel.soknader"
      })}`
    );

    const relevanteVedlegg = valgteVedlegg.filter(
      v => v.soknadsobjektId === valgtSoknadsobjekt._id
    );

    const vedleggTilInnsending = relevanteVedlegg.filter(
      v => v.skalSendes || v.pakrevd
    );

    const ikkePakrevdeVedlegg = relevanteVedlegg.filter(v => !v.pakrevd);
    const vedleggSvart = ikkePakrevdeVedlegg.filter(
      vedlegg => vedlegg.skalSendes !== undefined
    );

    let erNesteDisabled = ikkePakrevdeVedlegg.length !== vedleggSvart.length;
    return (
      <>
        <Underbanner
          tittel={localeTekst(valgtSoknadsobjekt.navn, intl.locale)}
          undertittel={localeTekst(hovedskjema.navn, intl.locale)}
          skjemanummer={hovedskjema.skjemanummer}
        />
        {relevanteVedlegg.length > 0 && (
          <>
            <Steg
              tittel="velgvedlegg.informasjonspanel.tittel"
              ingress={
                this.state.veiledning
                  ? "velgvedlegg.informasjonspanel.ingress"
                  : ""
              }
              beskrivelse={
                this.state.veiledning
                  ? "velgvedlegg.informasjonspanel.beskrivelse"
                  : ""
              }
            />
            <div className="papirsoknad__vedleggsvalgtoggle papirsoknad__vedleggsvalgtoggle--container">
              <ToggleGruppe
                defaultToggles={[
                  {
                    children: <FormattedMessage id="vedleggsvalg.toggle.veiledning" />,
                    pressed: true
                  },
                  {
                    children: <FormattedMessage id="vedleggsvalg.toggle.ikkeveiledning" />,
                  }
                ]}
                minstEn={true}
                onChange={(event, toggle) => this.onClick(event, toggle)}
              />
            </div>
            {!this.state.veiledning && (
              <AlertStripe type="advarsel">
                <FormattedMessage id="vedleggsvalg.toggle.advarsel" />
              </AlertStripe>
            )}
          </>
        )}
        {this.state.veiledning ? (
          <>
            <VeiledendeVedleggsvalg soknadsobjekt={valgtSoknadsobjekt} />
            <DineVedlegg
              visRadioButtons={true}
              visErVedleggPakrevd={true}
              vedleggTilInnsending={vedleggTilInnsending}
            />
          </>
        ) : (
          <Sjekkbokser soknadsobjekt={valgtSoknadsobjekt} />
        )}
        <Personalia nesteDisabled={erNesteDisabled} />
      </>
    );
  }
}

const mapStateToProps = (store: Store) => ({
  valgteVedlegg: store.vedlegg.valgteVedlegg
});

export default medValgtSoknadsobjekt<Props>(
  injectIntl<Props & InjectedIntlProps>(
    withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>>(
      connect(mapStateToProps)(PapirSoknad)
    )
  )
);
