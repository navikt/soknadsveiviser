import React, { Component } from "react";
import Kategorier from "./seksjoner/kategorier/Kategorimeny/Kategorimeny";
import { typeTilNorsk } from "../../utils/kategorier";
import { settValgtType } from "../../states/reducers/kategorier";
import { Kategori } from "../../typer/kategori";
import { withRouter, RouteComponentProps } from "react-router";
import Kategoriinnhold from "./seksjoner/kategorier/Kategoriinnhold/Kategoriinnhold";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Header from "../../komponenter/header/Header";
import SprakVelger from "../../komponenter/header/sprak/SprakVelger";
import { Sidetittel } from "nav-frontend-typografi";
import { FormattedMessage } from "react-intl";
import VeilederEttersendelse from "../../komponenter/veileder/varianter/Ettersendelse";
import VeilederKlage from "../../komponenter/veileder/varianter/Klage";
import Typer from "../../komponenter/header/typer/Typer";

interface Routes {
  inngang: string;
  personEllerBedrift: string;
}

interface ReduxProps {
  velgKategori: (kategori: Kategori) => void;
  settValgtType: (type: string) => void;
}

type MergedProps = RouteComponentProps<Routes> & ReduxProps;

class Soknadsveiviser extends Component<MergedProps> {
  componentDidMount() {
    const { match, settValgtType } = this.props;
    const { personEllerBedrift } = match.params;
    const type = typeTilNorsk(personEllerBedrift);
    settValgtType(type);
  }

  render() {
    const { match } = this.props;
    return (
      <div className="forside__wrapper" id="maincontent">
        <Header>
          <SprakVelger />
          <Sidetittel className="header__tittel">
            <FormattedMessage id="sidetittel" />
          </Sidetittel>
          {match.params.inngang === "ettersendelse" && <VeilederEttersendelse />}
          {match.params.inngang === "klage" && <VeilederKlage />}
          <Typer />
        </Header>
        <section className="seksjon oversikt">
          <Kategorier />
          <Kategoriinnhold />
          <section className="filler" />
        </section>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  settValgtType: (type: string) => dispatch(settValgtType(type))
});

export default withRouter(connect(undefined, mapDispatchToProps)(Soknadsveiviser));
