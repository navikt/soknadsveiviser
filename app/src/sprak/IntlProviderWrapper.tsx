import React, { Component, ComponentType } from "react";
import IntlProvider from "./IntlProvider";
import NavFrontendSpinner from "nav-frontend-spinner";
import alleTekster from "./tekster";
import { addLocaleData } from "react-intl";
import * as en from "react-intl/locale-data/en";
import * as nb from "react-intl/locale-data/nb";

const { Provider, Consumer } = React.createContext({
  locale: "" as string,
  tekster: {} as any,
  settLocale: (localeString: string) => {} // tslint:disable-line:no-empty
});

export interface IntlProviderWrapperState {
  locale: string;
  tekster: any;
}

export interface IntlProviderWrapperContextType
  extends IntlProviderWrapperState {
  settLocale(localeString: string): void;
}

class IntlProviderWrapper extends Component<{}, IntlProviderWrapperState> {
  constructor(props: {}) {
    super(props);
    this.settLocale = this.settLocale.bind(this);
  }

  settLocale(localeString: string) {
    let tekster;
    if (localeString === "en") {
      addLocaleData(en);
      tekster = alleTekster.en;
    } else {
      addLocaleData(nb);
      tekster = alleTekster.nb;
    }
    this.setState({ locale: localeString, tekster: tekster });
  }

  componentDidMount() {
    const pathname = window.location.pathname;
    pathname.includes("/english/")
      ? this.settLocale("en")
      : this.settLocale("nb");
  }

  render() {
    const { children } = this.props;
    const context: IntlProviderWrapperContextType = {
      ...this.state,
      settLocale: this.settLocale
    };

    return this.state ? (
      <Provider value={context}>
        <IntlProvider locale={this.state.locale} tekster={this.state.tekster}>
          {children}
        </IntlProvider>
      </Provider>
    ) : (
      <NavFrontendSpinner type={"XL"} />
    );
  }
}

export function IntlProviderWrapperHOC<PROPS>(
  Component: ComponentType<PROPS & { context: IntlProviderWrapperContextType }>
): ComponentType<PROPS> {
  return (props: PROPS) => (
    <Consumer>{context => <Component context={context} {...props} />}</Consumer>
  );
}

export default IntlProviderWrapper;
