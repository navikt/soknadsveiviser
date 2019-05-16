import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Forside from "./sider/1-forside/Forside";
import SkjemautlistingOversikt from "./sider/interne/skjemautlisting/Oversikt";
import SkjemautlistingDetaljert from "./sider/interne/skjemautlisting/Detaljert";
import Soknadstilpasser from "./sider/3-soknadstilpasser/Routes";
import Soknadsvelger from "./sider/2-soknadsvelger/Soknadsvelger";
import NotFound from "./sider/404/404";
import { withRouter, RouteComponentProps } from "react-router";
import createHistory from "history/createBrowserHistory";
import hashLinkScroll from "./utils/hashScroll";
import MedKategorier from "./states/providers/Kategorier";
import {
  IntlProviderWrapperContextType,
  IntlProviderWrapperHOC
} from "./sprak/IntlProviderWrapper";

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
    const history = createHistory();

    // Scroll til hash ved innlasting og navigasjon
    hashLinkScroll(window.location.hash);
    history.listen(location => hashLinkScroll(location.hash));

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
        <Route path={`${path}/:personEllerBedrift(person|bedrift)`}>
          <MedKategorier>
            <Route
              exact
              path={`${path}/:personEllerBedrift(person|bedrift)/:inngang(ettersendelse|klage)?/:kategori?`}
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
        </Route>
        <Route
          exact
          path={`${path}/skjemautlisting/:skjematype(skjema|sed)`}
          component={SkjemautlistingOversikt}
        />
        <Route
          exact
          path={`${path}/skjemautlisting/detaljert`}
          component={SkjemautlistingDetaljert}
        />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default IntlProviderWrapperHOC(withRouter(App));
