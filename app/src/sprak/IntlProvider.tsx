import * as React from "react";
import { IntlProvider as Provider } from "react-intl";
import { IntlProviderWrapperState } from "./IntlProviderWrapper";

class IntlProvider extends React.Component<IntlProviderWrapperState> {
  constructor(props: IntlProviderWrapperState) {
    super(props);
  }

  render() {
    const { children, ...props } = this.props;

    return (
      <Provider
        {...props}
        locale={this.props.locale}
        messages={this.props.tekster || []}
      >
        {children}
      </Provider>
    );
  }
}

export default IntlProvider;
