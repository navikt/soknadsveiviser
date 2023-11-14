import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Forside from "./sider/1-forside/Forside";
import Soknadstilpasser from "./sider/3-soknadstilpasser/Routes";
import Soknadsvelger from "./sider/2-soknadsvelger/Soknadsvelger";
import NotFound from "./sider/404/404";
import { withRouter, RouteComponentProps } from "react-router";
import { createBrowserHistory } from "history";
import hashLinkScroll from "./utils/hashScroll";
import MedKategorier from "./states/providers/Kategorier";
import { IntlProviderWrapperContextType, IntlProviderWrapperHOC } from "./sprak/IntlProviderWrapper";
import NySkjemaoversiktRedirects from "./redirects/NySkjemaoversiktRedirects";

interface Routes {
  sprak: string;
}

interface Context {
  context: IntlProviderWrapperContextType;
}

type MergedProps = RouteComponentProps<Routes> & Context;
class App extends Component<MergedProps> {
  componentDidMount() {
    const { match, context } = this.props;
    const { sprak } = match.params;
    const { settLocale } = context;
    const history = createBrowserHistory();

    // Scroll til hash ved innlasting og navigasjon
    hashLinkScroll(window.location.hash);
    history.listen((location) => hashLinkScroll(location.hash));

    // Sett default språk dersom urlen ikke er gyldlig
    switch (sprak) {
      case "en":
      case "nb":
        settLocale(sprak);
        break;
      default:
        settLocale("nb");
        break;
    }
  }

  render() {
    const { path } = this.props.match;
    return (
      <Switch>
        <Redirect
          exact
          from={`${path}/:inngang(ettersendelse|klage)`}
          to={`${path}/:inngang(ettersendelse|klage)/person`}
        />
        <Route
          path={`${path}/:inngang(ettersendelse|klage)?/:personEllerBedrift(person|bedrift)/:kategori?/:underkategori?/:skjemanummer?`}
        >
          <NySkjemaoversiktRedirects>
            <MedKategorier>
              <Route
                exact
                path={`${path}/:inngang(ettersendelse|klage)?/:personEllerBedrift(person|bedrift)/:kategori?`}
                component={Forside}
              />
              <Route
                exact
                path={`${path}/:personEllerBedrift(person|bedrift)/:kategori/:underkategori`}
                component={Soknadsvelger}
              />
              <Route
                path={`${path}/:personEllerBedrift(person|bedrift)/:kategori/:underkategori/:skjemanummer`}
                component={Soknadstilpasser}
              />
            </MedKategorier>
          </NySkjemaoversiktRedirects>
        </Route>
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default IntlProviderWrapperHOC(withRouter(App));
