import React, { Component } from "react";
import Kategorier from "./seksjoner/kategorier/Kategorier";
import { typeTilNorsk } from "../../utils/kategorier";
import { settValgtType } from "../../states/reducers/kategorier";
import { Kategori } from "../../typer/kategori";
import { withRouter, RouteComponentProps } from "react-router";
import Kategoriinnhold from "./seksjoner/kategorier/Kategoriinnhold";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Header from "../../komponenter/header/Header";

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
        <Header visTyper={true} inngang={match.params.inngang} />
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

export default withRouter(
  connect(
    undefined,
    mapDispatchToProps
  )(Soknadsveiviser)
);
