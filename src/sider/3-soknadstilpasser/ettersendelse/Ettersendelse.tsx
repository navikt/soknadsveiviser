import React, { Component } from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import { Store } from "../../../typer/store";
import { Soknadsobjekt } from "../../../typer/soknad";
import { Vedleggsobjekt } from "../../../typer/skjemaogvedlegg";
import { connect } from "react-redux";
import {Sjekkbokser} from "../felles/velgvedlegg/Sjekkbokser";
import Underbanner from "../../../komponenter/bannere/Underbanner";
import Personalia from "../felles/personalia/Personalia";
import Steg from "../../../komponenter/bannere/Steg";
import { medValgtSoknadsobjekt } from "../../../states/providers/ValgtSoknadsobjekt";
import { localeTekst } from "../../../utils/sprak";
import { sideTittel } from "../../../utils/sprak";
import Neste from "../felles/personalia/knapper/Neste";
import { genererDokumentinnsendingsUrl } from "../felles/dokumentinnsendingUtils";
import { finnesDokumentinnsending } from "../../../utils/soknadsobjekter";
import Helmet from "react-helmet";

interface Props {
  valgtSoknadsobjekt: Soknadsobjekt;
}

interface ReduxProps {
  valgteVedlegg: Vedleggsobjekt[];
}

interface Routes {
  innsendingsmate: string;
}

type MergedProps = Props &
  RouteComponentProps<Routes> &
  InjectedIntlProps &
  ReduxProps;

class Ettersendelse extends Component<
  MergedProps,
  { tilDokumentinnsending: boolean }
> {
  UNSAFE_componentWillMount() {
    const { valgtSoknadsobjekt} = this.props;
    const { innsendingsmate } = this.props.match.params;

    if (
      innsendingsmate === "dokumentinnsending" &&
      finnesDokumentinnsending(valgtSoknadsobjekt)
    ) {
      this.setState({ tilDokumentinnsending: true });
    }
  }

  render() {
    const { intl } = this.props;
    const { valgtSoknadsobjekt, valgteVedlegg } = this.props;

    const title = sideTittel(
      `${localeTekst(
        valgtSoknadsobjekt.navn,
        intl.locale
      )} - ${intl.formatMessage({ id: "ettersendelser.knapp" })}`
    );


    const vedleggTilInnsending = valgteVedlegg
      .filter(v => v.soknadsobjektId === valgtSoknadsobjekt!._id)
      .filter(v => v.skalSendes);

    const nesteDisabled = vedleggTilInnsending.length === 0;
    const { hovedskjema } = valgtSoknadsobjekt;
    return (
      <>
        <Helmet>
          <title>{title}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Underbanner
          tittel={localeTekst(valgtSoknadsobjekt.navn, intl.locale)}
          skjemanummer={hovedskjema.skjemanummer}
        />
        <Steg tittel="ettersendelser.tittel.underbanner" />
        <Sjekkbokser soknadsobjekt={valgtSoknadsobjekt} />
        {this.state && this.state.tilDokumentinnsending ? (
          <Neste
            lenke={genererDokumentinnsendingsUrl(
              valgtSoknadsobjekt,
              vedleggTilInnsending,
              true
            )}
            disabled={nesteDisabled}
          />
        ) : (
          <Personalia nesteDisabled={nesteDisabled} {...this.props} />
        )}
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
      connect(mapStateToProps)(Ettersendelse)
    )
  )
);
