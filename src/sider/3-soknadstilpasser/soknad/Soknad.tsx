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
import { Normaltekst } from "nav-frontend-typografi";

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

    let svartPaAlleSporsmal =
      ikkePakrevdeVedlegg.length === vedleggSvart.length || !this.state.veiledning;
    return (
      <>
        <Underbanner
          tittel={localeTekst(valgtSoknadsobjekt.navn, intl.locale)}
          undertittel={localeTekst(hovedskjema.navn, intl.locale)}
          skjemanummer={hovedskjema.skjemanummer}
        />
        {relevanteVedlegg.length > 0 && (
          <>
            <Steg tittel="velgvedlegg.informasjonspanel.tittel">
              {this.state.veiledning ? (
                <div className="stegBanner__seksjon">
                  <Normaltekst>
                    <FormattedMessage id="velgvedlegg.informasjonspanel.ingress" />
                  </Normaltekst>
                  <Normaltekst>
                    <FormattedMessage id="velgvedlegg.informasjonspanel.beskrivelse" />
                  </Normaltekst>
                </div>
              ) : (
                <div className="papirsoknad__alertstripe">
                  <AlertStripe type="advarsel" >
                    <FormattedMessage id="vedleggsvalg.toggle.advarsel" />
                  </AlertStripe>
                </div>
              )}
              <div className="papirsoknad__vedleggsvalgtoggle papirsoknad__vedleggsvalgtoggle--container">
                <ToggleGruppe
                  defaultToggles={[
                    {
                      children: (
                        <FormattedMessage id="vedleggsvalg.toggle.veiledning" />
                      ),
                      pressed: true
                    },
                    {
                      children: (
                        <FormattedMessage id="vedleggsvalg.toggle.ikkeveiledning" />
                      )
                    }
                  ]}
                  minstEn={true}
                  onChange={(event, toggle) => this.onClick(event, toggle)}
                />
              </div>
            </Steg>
          </>
        )}
        {this.state.veiledning ? (
          <>
            <VeiledendeVedleggsvalg soknadsobjekt={valgtSoknadsobjekt} />
            {svartPaAlleSporsmal && (
              <DineVedlegg
                visRadioButtons={true}
                visErVedleggPakrevd={true}
                vedleggTilInnsending={vedleggTilInnsending}
              />
            )}
          </>
        ) : (
          <Sjekkbokser soknadsobjekt={valgtSoknadsobjekt} skillUtPakrevde={true} />
        )}
        <Personalia nesteDisabled={!svartPaAlleSporsmal} />
      </>
    );
  }
}

const mapStateToProps = (store: Store) => ({
  valgteVedlegg: store.vedlegg.valgteVedlegg
});

export default medValgtSoknadsobjekt<Props>(
  injectIntl<Props & InjectedIntlProps>(
    withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>, any>(
      connect(mapStateToProps)(PapirSoknad)
    )
  )
);
