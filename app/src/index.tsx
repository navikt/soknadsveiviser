import "babel-polyfill";
import * as ReactDOM from "react-dom";
import * as React from "react";
import IntlProviderWrapper from "./sprak/IntlProviderWrapper";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import App from "./app";
import { store, persistor } from "./states/store";
import withMenu from "./mock/decorator/decorator-header-withmenu";
import megamenu from "./mock/decorator/decorator-megamenu";
import footer from "./mock/decorator/decorator-footer";
import scripts from "./mock/decorator/decorator-scripts";
import skiplinks from "./mock/decorator/decorator-skiplinks";
import styles from "./mock/decorator/decorator-styles";
import * as serviceWorker from "./service-worker";
import { fetchConfig } from "./klienter/serverKlient";
import { setConfig } from "./config";

const init = async () => {
  if (process.env.NODE_ENV === "development") {
    await import("./mock").then(({ setUpMock }) => setUpMock());
    document.body.innerHTML = document.body.innerHTML.replace(
      "{{{NAV_HEADING}}}",
      withMenu
    );
    document.body.innerHTML = document.body.innerHTML.replace(
      "{{{NAV_FOOTER}}}",
      footer
    );
    document.body.innerHTML = document.body.innerHTML.replace(
      "{{{NAV_STYLES}}}",
      styles
    );
    document.body.innerHTML = document.body.innerHTML.replace(
      "{{{NAV_SCRIPTS}}}",
      scripts
    );
    document.body.innerHTML = document.body.innerHTML.replace(
      "{{{NAV_SKIPLINKS}}}",
      skiplinks
    );
    document.body.innerHTML = document.body.innerHTML.replace(
      "{{{MEGAMENU_RESOURCES}}}",
      megamenu
    );
  }
  const config = await fetchConfig();
  setConfig(config);

  const baseUrl = "/soknadsveiviser";
  const redirectFrom = `(${baseUrl}|/)`;
  const redirectTo = `${baseUrl}/nb/person`;
  ReactDOM.render(
    <IntlProviderWrapper>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <Switch>
              <Redirect exact from={redirectFrom} to={redirectTo} />
              <Route path={`${baseUrl}/:sprak`} component={App} />
            </Switch>
          </Router>
        </PersistGate>
      </Provider>
    </IntlProviderWrapper>,
    document.getElementById("app")
  );
  serviceWorker.unregister();
};
init();
