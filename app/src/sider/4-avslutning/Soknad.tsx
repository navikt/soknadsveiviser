import React, { Component } from "react";
import { medPersonalia, Personalia } from "../../states/providers/Personalia";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Normaltekst } from "nav-frontend-typografi";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { RouteComponentProps, Redirect } from "react-router-dom";
import { Vedleggsobjekt } from "../../typer/vedlegg";
import { Store } from "../../typer/store";
import { Soknadsobjekt } from "../../typer/soknad";
import StegOverskrift from "./steg/Overskrift";
import StegBanner from "../../komponenter/bannere/Steg";
import Underbanner from "../../komponenter/bannere/Underbanner";
import Sprak from "./steg/Sprak";
import VedleggListe from "./steg/VedleggListe";
import VedleggNedlasting from "./steg/VedleggNedlasting";
import ForstesideGenerator from "./steg/ForstesideGenerator";
import SkjemaNedlasting from "./steg/SkjemaNedlasting";
import { loggEvent } from "../../utils/logger";
import { localeTekst } from "../../utils/sprak";
import { medValgtSoknadsobjekt } from "../../states/providers/ValgtSoknadsobjekt";
import { erTom } from "../../utils/validering/personalia";

interface State {
  skjemaSprak: string;
}

interface ValgtSoknad {
  valgtSoknadsobjekt: Soknadsobjekt;
  klageSoknadsobjekt: Soknadsobjekt;
}

interface ReduxProps {
  valgteVedlegg: Vedleggsobjekt[];
}

interface Routes {
  skjemanummer: string;
  ettersendelse: string;
}

type MergedProps = ValgtSoknad &
  Personalia &
  RouteComponentProps<Routes> &
  InjectedIntlProps &
  ReduxProps;

class Avslutning extends Component<MergedProps, State> {
  state = {
    skjemaSprak: this.props.intl.locale
  };

  byttSprak = (valgtSprak: string) =>
    this.setState({ skjemaSprak: valgtSprak });

  componentWillMount = () => {
    const { skjemanummer } = this.props.match.params;
    loggEvent("soknadsveiviser.valgt.skjemanummer", undefined, {
      skjemanummer
    });
  };

  render() {
    const { props } = this;
    const { valgteVedlegg } = props;
    const { valgtSoknadsobjekt } = props;
    const { url } = props.match;
    const { ettersendelse } = props.match.params;
    const { skjemaSprak } = this.state;
    const { bedrift, adresse, fodselsnummer } = props;
    const locale = props.intl.locale;
    const harPersonalia =
      !erTom(fodselsnummer) || !erTom(adresse) || !erTom(bedrift);

    if (!harPersonalia) {
      return <Redirect to={url.replace("/avslutning", "")} />;
    }

    const relevanteVedlegg = valgteVedlegg
      .filter(v => v.soknadsobjektId === valgtSoknadsobjekt._id)
      .filter(v => (ettersendelse ? v.skalSendes : v.skalSendes || v.pakrevd));

    const vedleggTilNedlasting = relevanteVedlegg
      .filter(v => !v.skalEttersendes)
      .filter(({ vedlegg }) => vedlegg.skjematilvedlegg);

    const vedleggTilEttersendelse = relevanteVedlegg.filter(
      v => v.skalEttersendes
    );

    const eksterneVedlegg = relevanteVedlegg
      .filter(v => !v.skalEttersendes)
      .filter(({ vedlegg }) => !vedlegg.skjematilvedlegg);

    let steg = 0;
    const { hovedskjema } = valgtSoknadsobjekt;
    return (
      <>
        <Underbanner
          tittel={localeTekst(valgtSoknadsobjekt.navn, locale)}
          undertittel={localeTekst(valgtSoknadsobjekt.navn, locale)}
          skjemanummer={hovedskjema.skjemanummer}
        />
        <StegBanner tittel="avslutning.sidetittel" />
        <div className="kvittering">
          {eksterneVedlegg.length > 0 && (
            <VedleggListe
              steg={++steg}
              vedlegg={eksterneVedlegg}
              tittel="avslutning.steg.eksterne.tittel"
            />
          )}
          {vedleggTilEttersendelse.length > 0 && (
            <VedleggListe
              steg={++steg}
              vedlegg={vedleggTilEttersendelse}
              tittel="avslutning.steg.ettersendelse.tittel"
            />
          )}
          <Sprak
            steg={++steg}
            valgtSoknadsobjekt={valgtSoknadsobjekt}
            skjemaSprak={skjemaSprak}
            byttSprak={this.byttSprak}
          />
          <ForstesideGenerator
            steg={++steg}
            relevanteVedlegg={relevanteVedlegg}
            skjemaSprak={skjemaSprak}
          />
          {!ettersendelse && (
            <SkjemaNedlasting
              steg={++steg}
              soknadsobjekt={valgtSoknadsobjekt}
              skjemaSprak={skjemaSprak}
            />
          )}
          {vedleggTilNedlasting.length > 0 && (
            <VedleggNedlasting
              steg={++steg}
              vedlegg={vedleggTilNedlasting}
              skjemaSprak={skjemaSprak}
            />
          )}
          <div className="steg__rad">
            <StegOverskrift
              steg={++steg}
              tittel="avslutning.steg.innsending.tittel"
              beskrivelse="avslutning.steg.innsending.beskrivelse"
            />
            <Normaltekst>
              <b>
                <FormattedMessage id="avslutning.steg.innsending.obs" />
              </b>
            </Normaltekst>
          </div>
          <div className="steg__rad">
            <StegOverskrift
              steg={++steg}
              tittel="avslutning.steg.videre.tittel"
              beskrivelse="avslutning.steg.videre.beskrivelse"
            />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (store: Store) => ({
  valgteVedlegg: store.vedlegg.valgteVedlegg
});

export default medValgtSoknadsobjekt<ValgtSoknad>(
  injectIntl<ValgtSoknad & InjectedIntlProps>(
    withRouter<ValgtSoknad & InjectedIntlProps & RouteComponentProps<Routes>>(
      medPersonalia<
        Personalia &
          ValgtSoknad &
          InjectedIntlProps &
          RouteComponentProps<Routes>
      >(connect(mapStateToProps)(Avslutning))
    )
  )
);
