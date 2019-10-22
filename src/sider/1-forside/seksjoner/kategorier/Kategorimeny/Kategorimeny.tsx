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

  componentDidMount = () => {
    window.addEventListener("resize", this.handleWindowSize);
    this.settTittel();
  };

  componentDidUpdate = () => this.settTittel();
  componentWillUnmount = () =>
    window.removeEventListener("resize", this.handleWindowSize);

  settTittel = () => {
    const { valgtKategori, intl } = this.props;
    const { locale } = intl;
    document.title = sideTittel(
      `${localeTekst(valgtKategori.tittel, locale)} - ${intl.formatMessage({
        id: "tittel.soknader"
      })}`
    );
  };
  render = () => {
    const { windowSize } = this.state;
    const { alleKategorier, valgtType } = this.props;

    const erTablet = windowSize > 650;
    const erDesktop = windowSize > 1032;
    const aktiveKategorier = filtrerKategorier(alleKategorier, valgtType);

    return erDesktop ? (
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
  };
}

export default medKategorier<Props>(
  injectIntl<Props & InjectedIntlProps>(
    withRouter<Props & InjectedIntlProps & RouteComponentProps>(Kategorimeny)
  )
);
