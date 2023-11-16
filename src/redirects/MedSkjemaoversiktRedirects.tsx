import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { RedirectTilSkjemaoversikt } from "./RedirectTilSkjemaoversikt";

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

class MedSkjemaoversiktRedirects extends Component<Props> {
  render() {
    const { params } = this.props.match;

    if (!params.skjemanummer) {
      return <RedirectTilSkjemaoversikt params={params} />;
    }

    return this.props.children;
  }
}

export default withRouter(MedSkjemaoversiktRedirects);
