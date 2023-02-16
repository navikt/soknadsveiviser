import React, { Component } from "react";
import Desktop from "../responsiv/Desktop";
import TabletEllerMobil from "../responsiv/TabletEllerMobil";
import { Kategori } from "../../../../../typer/kategori";
import { Underkategori } from "../../../../../typer/underkategori";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { withRouter, RouteComponentProps } from "react-router";
import { filtrerKategorier } from "../../../../../utils/kategorier";
import { medKategorier } from "../../../../../states/providers/Kategorier";
import { localeTekst, sideTittel } from "../../../../../utils/sprak";
import {Helmet} from "react-helmet";

type State = {
  windowSize: number;
};

interface Props {
  valgtType: "Person" | "Bedrift";
  valgtKategori: Kategori;
  valgtUnderkategori: Underkategori;
  alleKategorier: Kategori[];
}

type MergedProps = Props & RouteComponentProps & InjectedIntlProps;
class Kategorimeny extends Component<MergedProps, State> {
  state = {
    windowSize: window.innerWidth
  };

  handleWindowSize = () =>
    this.setState({
      windowSize: window.innerWidth
    });

  UNSAFE_componentWillMount = () => {
    window.addEventListener("resize", this.handleWindowSize);
  };

  componentWillUnmount = () =>
    window.removeEventListener("resize", this.handleWindowSize);

  render = () => {
    const { windowSize } = this.state;
    const { alleKategorier, valgtType } = this.props;

    const erTablet = windowSize > 650;
    const erDesktop = windowSize > 1032;
    const aktiveKategorier = filtrerKategorier(alleKategorier, valgtType);
    const { valgtKategori, intl } = this.props;
    const { locale } = intl;

    const content = erDesktop ? (
      <Desktop
        valgtKategori={this.props.valgtKategori}
        aktiveKategorier={aktiveKategorier}
      />
    ) : (
      <TabletEllerMobil
        erTablet={erTablet}
        valgtKategori={this.props.valgtKategori}
        aktiveKategorier={aktiveKategorier}
      />
    );
    return <>
      <Helmet>
        <title>
          {sideTittel(
          `${localeTekst(valgtKategori.tittel, locale)} - ${intl.formatMessage({
          id: "tittel.soknader"
        })}`)}
        </title>
        <meta name="description"
              content={intl.formatMessage(
                {id: 'kategori.meta_desc'},
                {kategoritittel: localeTekst(valgtKategori.tittel, locale)})} />
      </Helmet>
      {content}
    </>
  };
}

export default medKategorier<Props>(
  injectIntl<Props & InjectedIntlProps>(
    withRouter<Props & InjectedIntlProps & RouteComponentProps, any>(Kategorimeny)
  )
);
