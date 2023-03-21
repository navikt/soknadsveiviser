import React, { Component, ComponentType } from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import { apiHentSoknadsobjekt } from "../../klienter/sanityKlient";
import { FetchSoknad } from "../../typer/store";
import { Soknadsobjekt } from "../../typer/soknad";
import Spinner from "../../komponenter/spinner/Spinner";
import HttpError from "../../komponenter/errors/HttpError";
import NotFound from "../../sider/404/404";
import { Dispatch } from "redux";
import { Store } from "../../typer/store";
import { connect } from "react-redux";

export interface ValgtSoknad {
  valgtSoknadsobjekt: Soknadsobjekt;
  klageSoknadsobjekt?: Soknadsobjekt;
}

interface Props {
  children?: JSX.Element | JSX.Element[];
}

interface Routes {
  skjemanummer: string;
  kategori: string;
  underkategori: string;
}

interface ReduxProps {
  valgtSoknad: FetchSoknad;
  hentSoknadsobjekt: (
    kategori: string,
    underkategori: string,
    skjemanummer: string
  ) => void;
}

type MergedProps = Props &
  ReduxProps &
  RouteComponentProps<Routes> &
  InjectedIntlProps;

const { Provider, Consumer } = React.createContext<ValgtSoknad | null>(null);
class MedValgtSoknadsobjekt extends Component<MergedProps> {
  componentDidMount() {
    const { hentSoknadsobjekt, valgtSoknad } = this.props;
    const { kategori, underkategori, skjemanummer } = this.props.match.params;
    valgtSoknad.status !== "RESULT" &&
      hentSoknadsobjekt(kategori, underkategori, skjemanummer);
  }

  render() {
    switch (this.props.valgtSoknad.status) {
      case "LOADING":
        return <Spinner style={{ backgroundColor: "white" }} />;
      case "RESULT":
        const result = this.props.valgtSoknad;
        return <Provider value={result}>{this.props.children}</Provider>;
      case "DATA_ERROR":
        return (
          <NotFound
            style={{ backgroundColor: "white" }}
            message={this.props.valgtSoknad.error}
          />
        );
      case "HTTP_ERROR":
        return (
          <HttpError
            style={{ backgroundColor: "white", padding: 10 }}
            error={this.props.valgtSoknad.error}
          />
        );
      default:
        return null;
    }
  }
}

const mapStateToProps = (store: Store) => ({
  valgtSoknad: store.valgtSoknad
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  hentSoknadsobjekt: (
    kategori: string,
    underkategori: string,
    skjemanummer: string
  ) => apiHentSoknadsobjekt(kategori, underkategori, skjemanummer)(dispatch)
});

export const medValgtSoknadsobjekt = <P extends ValgtSoknad>(
  Component: ComponentType<P>
) => (props: Pick<P, Exclude<keyof P, keyof ValgtSoknad>>) => (
  <Consumer>
    {value => <Component {...value as ValgtSoknad} {...props as P} />}
  </Consumer>
);

export default injectIntl<Props & InjectedIntlProps>(
  withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>, any>(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(MedValgtSoknadsobjekt)
  )
);
