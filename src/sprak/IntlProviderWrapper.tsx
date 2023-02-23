import React, { Component, ComponentType } from "react";
import IntlProvider from "./IntlProvider";
import NavFrontendSpinner from "nav-frontend-spinner";
import alleTekster from "./tekster";

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
  settLocale = (localeString: string) => {
    let tekster;
    if (localeString === "en") {
      tekster = alleTekster.en;
    } else {
      tekster = alleTekster.nb;
    }
    this.setState({ locale: localeString, tekster: tekster });
  };

  UNSAFE_componentWillMount() {
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
