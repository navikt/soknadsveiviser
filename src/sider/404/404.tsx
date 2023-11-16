import React, { Component, CSSProperties } from "react";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import { AllRoutes } from "../../redirects/MedSkjemaoversiktRedirects";
import { RedirectTilSkjemaoversikt } from "../../redirects/RedirectTilSkjemaoversikt";

type Props = {
  style?: CSSProperties;
  message?: string;
} & InjectedIntlProps &
  RouteComponentProps<AllRoutes>;

class NotFound extends Component<Props> {
  render() {
    return <RedirectTilSkjemaoversikt params={this.props.match.params} />;
  }
}

export default withRouter(injectIntl<Props & InjectedIntlProps>(NotFound));
