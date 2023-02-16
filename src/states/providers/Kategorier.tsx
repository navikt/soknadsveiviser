import React, { Component, ComponentType } from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import { apiHentAlleKategorier } from "../../klienter/sanityKlient";
import { FetchKategorier } from "../../typer/store";
import Spinner from "../../komponenter/spinner/Spinner";
import HttpError from "../../komponenter/errors/HttpError";
import { Dispatch } from "redux";
import NotFound from "../../sider/404/404";
import { Store, Kategorier } from "../../typer/store";
import { connect } from "react-redux";

interface Props {
  children?: JSX.Element | JSX.Element[];
}

interface Routes {
  skjemanummer: string;
  kategori: string;
  underkategori: string;
}

interface ReduxProps {
  kategorier: FetchKategorier;
  hentKategorier: () => void;
}

export type ValgtKategori = Kategorier & { valgtType: "Person" | "Bedrift" };

type MergedProps = Props &
  ReduxProps &
  RouteComponentProps<Routes> &
  InjectedIntlProps;

const { Provider, Consumer } = React.createContext({});

class MedKategorier extends Component<MergedProps> {
  UNSAFE_componentWillMount() {
    const { kategorier, hentKategorier } = this.props;
    kategorier.status !== "RESULT" && hentKategorier();
  }

  render() {
    switch (this.props.kategorier.status) {
      case "LOADING":
        return <Spinner />;
      case "RESULT":
        const result = this.props.kategorier;
        return <Provider value={result}>{this.props.children}</Provider>;
      case "DATA_ERROR":
        return <NotFound message={this.props.kategorier.error} />;
      case "HTTP_ERROR":
        return (
          <section className="seksjon oversikt">
            <div className="innhold__container">
              <HttpError error={this.props.kategorier.error} />
            </div>
          </section>
        );
      default:
        return null;
    }
  }
}

const mapStateToProps = (store: Store) => ({
  kategorier: store.kategorier
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  hentKategorier: async () => apiHentAlleKategorier()(dispatch)
});

export const medKategorier = <P extends ValgtKategori>(
  Component: ComponentType<P>
) => (props: Pick<P, Exclude<keyof P, keyof ValgtKategori>>) => (
  <Consumer>
    {value => <Component {...value as ValgtKategori} {...props as P} />}
  </Consumer>
);

export default injectIntl<Props & InjectedIntlProps>(
  withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>, any>(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(MedKategorier)
  )
);
