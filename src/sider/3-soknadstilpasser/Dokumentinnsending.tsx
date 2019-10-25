import React, { Component, SyntheticEvent } from "react";
import VelgVedlegg from "./felles/velgvedlegg/VeiledendeVedleggsvalg";
import Sjekkbokser from "./felles/velgvedlegg/Sjekkbokser";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import Underbanner from "../../komponenter/bannere/Underbanner";
import { Vedlegg, Vedleggsobjekt } from "../../typer/skjemaogvedlegg";
import { Store } from "../../typer/store";
import { Soknadsobjekt } from "../../typer/soknad";
import { connect } from "react-redux";
import { getTjenesteUrl } from "../../config";
import DineVedlegg from "./felles/dinevedlegg/DineVedlegg";
import { localeTekst, sideTittel } from "../../utils/sprak";
import { medValgtSoknadsobjekt } from "../../states/providers/ValgtSoknadsobjekt";
import Neste from "./felles/personalia/knapper/Neste";
import Steg from "../../komponenter/bannere/Steg";
import { Normaltekst } from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";
import { ToggleGruppe, ToggleKnappPureProps } from "nav-frontend-toggle";

interface Props {
  valgtSoknadsobjekt: Soknadsobjekt;
}

interface Routes {
  skjemanummer: string;
  kategori: string;
  underkategori: string;
  ettersendelse: string;
}

interface ReduxProps {
  valgteVedlegg: Vedleggsobjekt[];
}

type MergedProps = Props &
  ReduxProps &
  RouteComponentProps<Routes> &
  InjectedIntlProps;

class Dokumentinnsending extends Component<
  MergedProps,
  { veiledning: boolean }
> {
  constructor(props: MergedProps) {
    super(props);
    this.state = { veiledning: true };
  }

  genererDokumentinnsendingsUrl = (
    valgtSoknadsobjekt: Soknadsobjekt,
    vedlegg: Vedleggsobjekt[],
    ettersendelse: string
  ) => {
    const { hovedskjema } = valgtSoknadsobjekt;

    // Send med skjemanummer dersom det eksisterer, ellers vedleggsid
    const hentSkjemanrEllerVedleggid = (vedlegg: Vedlegg) =>
      vedlegg.skjematilvedlegg
        ? vedlegg.skjematilvedlegg.skjemanummer
        : vedlegg.vedleggsid;

    const vedleggTilInnsending = vedlegg
      .filter(v => v.soknadsobjektId === valgtSoknadsobjekt._id)
      .filter(v => v.skalSendes || v.pakrevd)
      .map(({ vedlegg }) => hentSkjemanrEllerVedleggid(vedlegg))
      .join();

    return encodeURI(
      getTjenesteUrl() +
        "/dokumentinnsending/opprettSoknadResource?skjemanummer=" +
        hovedskjema.skjemanummer +
        "&erEttersendelse=" +
        (ettersendelse ? "true" : "false") +
        (vedleggTilInnsending ? "&vedleggsIder=" + vedleggTilInnsending : "")
    );
  };

  onClick = (
    event: SyntheticEvent<EventTarget>,
    toggles: ToggleKnappPureProps[]
  ) => {
    this.state.veiledning !== toggles[0].pressed &&
      this.setState({ veiledning: !this.state.veiledning });
  };

  render() {
    const { ettersendelse } = this.props.match.params;
    const { intl, valgteVedlegg, valgtSoknadsobjekt } = this.props;
    const { hovedskjema } = valgtSoknadsobjekt;

    document.title = sideTittel(
      `${localeTekst(
        valgtSoknadsobjekt.navn,
        intl.locale
      )}  - ${intl.formatMessage({
        id: ettersendelse
          ? "ettersendelser.mellomledd.digital.knapp"
          : "vissoknadsobjekter.knapp.soknadsdialog"
      })}`
    );

    const vedleggTilInnsending = valgteVedlegg
      .filter(v => v.soknadsobjektId === valgtSoknadsobjekt._id)
      .filter(v => (ettersendelse ? v.skalSendes : v.skalSendes || v.pakrevd));

    const ikkePakrevdeVedlegg = valgteVedlegg
      .filter(v => v.soknadsobjektId === valgtSoknadsobjekt._id)
      .filter(v => !v.pakrevd);

    const vedleggSvart = ikkePakrevdeVedlegg.filter(
      vedlegg => vedlegg.skalSendes !== undefined
    );

    let erNesteDisabled =
      (ettersendelse && vedleggTilInnsending.length === 0) ||
      (!ettersendelse &&
        ikkePakrevdeVedlegg.length !== vedleggSvart.length &&
        this.state.veiledning);

    const URLvidere = this.genererDokumentinnsendingsUrl(
      valgtSoknadsobjekt,
      vedleggTilInnsending,
      ettersendelse
    );

    return (
      <>
        <Underbanner
          tittel={localeTekst(valgtSoknadsobjekt.navn, intl.locale)}
          undertittel={localeTekst(hovedskjema.navn, intl.locale)}
          skjemanummer={hovedskjema.skjemanummer}
        />
        {ettersendelse ? (
          <>
            <Steg tittel="ettersendelser.tittel.underbanner" />
            <Sjekkbokser soknadsobjekt={valgtSoknadsobjekt} />
          </>
        ) : (
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
                <AlertStripe type="advarsel">
                  <FormattedMessage id="vedleggsvalg.toggle.advarsel" />
                </AlertStripe>
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
            {this.state.veiledning ? (
              <>
                <VelgVedlegg soknadsobjekt={valgtSoknadsobjekt} />
                {!erNesteDisabled && (
                  <DineVedlegg
                    visErVedleggPakrevd={true}
                    vedleggTilInnsending={vedleggTilInnsending}
                  />
                )}
              </>
            ) : (
              <Sjekkbokser soknadsobjekt={valgtSoknadsobjekt} />
            )}
          </>
        )}
        <Neste lenke={URLvidere} disabled={erNesteDisabled} />
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
      connect(mapStateToProps)(Dokumentinnsending)
    )
  )
);
