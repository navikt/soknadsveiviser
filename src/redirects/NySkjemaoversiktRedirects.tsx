import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { getApplicableSkjemaoversiktRedirect } from "./redirects";

export type AllRoutes = Partial<{
  sprak: string;
  inngang: "ettersendelse" | "klage";
  personEllerBedrift: "person" | "bedrift";
  kategori: string;
  underkategori: string;
  skjemanummer: string;
}>;

type Props = {
  children: JSX.Element;
} & RouteComponentProps<AllRoutes>;

class NySkjemaoversiktRedirects extends Component<Props> {
  render() {
    const { params } = this.props.match;

    const { sprak, skjemanummer } = params;

    if (sprak === "en" || !!skjemanummer) {
      return this.props.children;
    }

    const redirectUrl = getApplicableSkjemaoversiktRedirect(params);
    console.log(`Redirecting to ${redirectUrl}`);

    window.location.replace(redirectUrl);

    return null;
  }
}

export default withRouter(NySkjemaoversiktRedirects);
