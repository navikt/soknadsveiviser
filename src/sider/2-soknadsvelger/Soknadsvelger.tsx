import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Store } from "../../typer/store";
import Spinner from "../../komponenter/spinner/Spinner";
import Wrapper from "../../komponenter/wrapper/Wrapper";
import HttpError from "../../komponenter/errors/HttpError";
import DataError from "../../komponenter/errors/DataError";
import { apiHentSoknader } from "../../klienter/sanityKlient";
import { injectIntl, InjectedIntlProps } from "react-intl";
import VisSoknadsobjekt from "./seksjoner/VisSoknadsobjekt";
import VisSoknadslenke from "./seksjoner/VisSoknadslenke";
import { FetchSoknader } from "../../typer/store";
import { Kategori } from "../../typer/kategori";
import { Underkategori } from "../../typer/underkategori";
import Soknadsdialog from "./seksjoner/Soknadsdialog";
import { loggEvent } from "../../utils/logger";
import { medKategorier } from "../../states/providers/Kategorier";
import hashLinkScroll from "../../utils/hashScroll";
import { localeTekst, sideTittel } from "../../utils/sprak";
import VisSkjemalenke from "./seksjoner/VisSkjemalenke";
import Helmet from "react-helmet";

interface Routes {
  kategori: string;
  underkategori: string;
}

interface Props {
  valgtType: "Person" | "Bedrift";
  valgtKategori: Kategori;
  valgtUnderkategori: Underkategori;
  alleKategorier: Kategori[];
}

interface ReduxProps {
  soknader: FetchSoknader;
  hentSoknader: (kategori: string, underkategori: string) => void;
}

type MergedProps = Props & ReduxProps & RouteComponentProps<Routes> & InjectedIntlProps;

class Soknadsobjekter extends Component<MergedProps> {
  componentDidMount() {
    const { kategori, underkategori } = this.props.match.params;
    this.props.hentSoknader(kategori, underkategori);
    loggEvent("soknadsveiviser.underkategori.navn", undefined, {
      underkategoriType: underkategori
    });
  }

  hasSoknadsDialog() {
    if (!this.props.valgtUnderkategori) {
      return false;
    }
    return (
      ((this.props.valgtUnderkategori.inngangtilsoknadsdialog || {}).soknadsdialogURL || {})[this.props.intl.locale] ||
      false
    );
  }

  renderSoknader() {
    const { soknader, valgtUnderkategori, intl } = this.props;
    switch (soknader.status) {
      default:
      case "LOADING":
        return <Spinner style={{ backgroundColor: "white" }} />;
      case "RESULT":
        let ettApentObjekt =
          soknader.soknadsobjekter.length + soknader.soknadslenker.length + soknader.skjemalenker.length === 1;
        let apentSoknadsobjekt = ettApentObjekt && soknader.soknadsobjekter.length === 1;
        let apenSkjemalenke = ettApentObjekt && soknader.skjemalenker.length === 1;
        let apenSoknadslenke = ettApentObjekt && soknader.soknadslenker.length === 1;
        let utlisting: string[] = [];
        if (this.hasSoknadsDialog()) {
          utlisting.push(
            `${intl.formatMessage({ id: "vissoknadsobjekter.tittel" })} ${localeTekst(
              valgtUnderkategori.navn,
              intl.locale
            ).toLowerCase()}`
          );
        }
        utlisting = utlisting.concat(
          soknader.soknadsobjekter.map(
            soknadsobjekt =>
              `${localeTekst(soknadsobjekt.navn, intl.locale)} - ${soknadsobjekt.hovedskjema.skjemanummer}`
          )
        );
        utlisting = utlisting.concat(
          soknader.skjemalenker.map(
            skjemalenke => `${localeTekst(skjemalenke.navn, intl.locale)} - ${skjemalenke.hovedskjema.skjemanummer}`
          )
        );
        utlisting = utlisting.concat(
          soknader.soknadslenker.map(soknadslenke => `${localeTekst(soknadslenke.navn, intl.locale)}`)
        );
        return (
          <>
            <Helmet>
              <meta
                name="description"
                content={intl.formatMessage(
                  { id: "underkategori.meta_desc" },
                  {
                    underkategorinavn: localeTekst(valgtUnderkategori.navn, intl.locale),
                    utlisting: utlisting.join("; ")
                  }
                )}
              />
            </Helmet>
            {this.hasSoknadsDialog() && <Soknadsdialog valgtUnderkategori={valgtUnderkategori} />}
            {soknader.soknadsobjekter?.map((soknadsobjekt, id) => (
              <VisSoknadsobjekt key={id} soknadsobjekt={soknadsobjekt} apen={apentSoknadsobjekt} />
            ))}
            {soknader.skjemalenker?.map((skjemalenke, id) => (
              <VisSkjemalenke key={id} skjemalenke={skjemalenke} apen={apenSkjemalenke} />
            ))}
            {soknader.soknadslenker?.map((soknadslenke, id) => (
              <VisSoknadslenke key={id} soknadslenke={soknadslenke} apen={apenSoknadslenke} />
            ))}
          </>
        );
      case "DATA_ERROR":
        return <DataError style={{ backgroundColor: "white", padding: 10 }} error={soknader.error} />;
      case "HTTP_ERROR":
        return <HttpError style={{ backgroundColor: "white", padding: 10 }} error={soknader.error} />;
    }
  }

  render() {
    const { valgtUnderkategori, intl } = this.props;
    const { locale } = intl;
    return (
      <Wrapper>
        <Helmet>
          <title>
            {sideTittel(
              `${localeTekst(valgtUnderkategori.navn, locale)} - ${intl.formatMessage({
                id: "tittel.soknader"
              })}`
            )}
          </title>
        </Helmet>
        {this.renderSoknader()}
      </Wrapper>
    );
  }
}

const mapStateToProps = (store: Store) => ({
  soknader: store.soknader
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  hentSoknader: async (kategori: string, underkategori: string) => {
    apiHentSoknader(kategori, underkategori)(dispatch);
    hashLinkScroll(window.location.hash);
  }
});

export default medKategorier<Props>(
  injectIntl<Props & InjectedIntlProps>(
    withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>, any>(
      connect(mapStateToProps, mapDispatchToProps)(Soknadsobjekter)
    )
  )
);
