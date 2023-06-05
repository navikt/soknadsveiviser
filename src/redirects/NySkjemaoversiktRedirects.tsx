import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { getSkjemaoversiktUrl } from "./redirects";

type Routes = Partial<{
  sprak: string;
  inngang: "ettersendelse" | "klage";
  personEllerBedrift: "person" | "bedrift";
  kategori: string;
  underkategori: string;
  skjemanummer: string;
}>;

type Props = {
  children: JSX.Element;
} & RouteComponentProps<Routes>;

class NySkjemaoversiktRedirects extends Component<Props> {
  render() {
    const { params } = this.props.match;

    const { sprak, skjemanummer } = params;

    console.log(`Params: ${JSON.stringify(params)}`);

    if (sprak === "en" || !!skjemanummer) {
      return this.props.children;
    }

    const redirectUrl = getApplicableRedirect(params);
    console.log(`Redirecting to ${redirectUrl}`);

    window.location.replace(redirectUrl);

    return null;
  }
}

const getApplicableRedirect = (matchParams: Routes) => {
  const { personEllerBedrift, underkategori, kategori, inngang } = matchParams;

  if (personEllerBedrift === "bedrift") {
    return getSkjemaoversiktUrl("arbeidsgiver");
  }

  if (inngang === "klage") {
    return getSkjemaoversiktUrl("personKlage");
  }

  if (inngang === "ettersendelse") {
    return getSkjemaoversiktUrl("personEttersendelse");
  }

  return getSkjemaoversiktUrl("personSkjema");
};

export default withRouter(NySkjemaoversiktRedirects);
