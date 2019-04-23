import React, { Component } from "react";
import { apiKallSamlet } from "../../../klienter/sanityKlient";
import Innholdstittel from "nav-frontend-typografi/lib/innholdstittel";
import Undertittel from "nav-frontend-typografi/lib/undertittel";
import { Kategori } from "../../../typer/kategori";
import { RouteComponentProps } from "react-router-dom";
import VisSoknadsobjekt from "./seksjoner/Soknadsobjekt";
import Wrapper from "../../../komponenter/wrapper/Wrapper";
import Hovedbanner from "../../../komponenter/bannere/Hovedbanner";
import { injectIntl, InjectedIntlProps } from "react-intl";
import Spinner from "../../../komponenter/spinner/Spinner";
import { localeTekst } from "../../../utils/sprak";
import LocaleTekst from "../../../komponenter/localetekst/LocaleTekst";

interface State {
  data: Kategori[];
}

type MergedProps = RouteComponentProps & InjectedIntlProps;
class SkjemautlistingDetaljert extends Component<MergedProps, State> {
  state = { data: [] };
  componentDidMount = () => this.hentDataFraSanity();

  hentDataFraSanity = () =>
    apiKallSamlet().then(
      (sanityData: any[]) => sanityData && this.setState({ data: sanityData })
    );

  render() {
    if (!this.state.data.length) {
      return <Spinner />;
    }

    const { intl } = this.props;
    const { data } = this.state;

    return (
      <Wrapper>
        <Hovedbanner tittel="Skjemautlisting" undertittel="Detaljert" />
        <div className="innhold">
          {data.map((kategori: Kategori) => (
            <div key={kategori._id}>
              <Innholdstittel>
                <LocaleTekst tekst={kategori.tittel} />
              </Innholdstittel>
              {kategori.underkategorier.map(underkategori => (
                <div key={localeTekst(underkategori.navn, intl.locale)}>
                  <Undertittel>
                    <LocaleTekst tekst={underkategori.navn} />
                  </Undertittel>
                  {underkategori.soknadsobjekter &&
                    underkategori.soknadsobjekter.map(soknadsobjekt => (
                      <VisSoknadsobjekt
                        key={soknadsobjekt._id}
                        kategori={kategori}
                        underkategori={underkategori}
                        soknadsobjekt={soknadsobjekt}
                      />
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Wrapper>
    );
  }
}

export default injectIntl(SkjemautlistingDetaljert);
