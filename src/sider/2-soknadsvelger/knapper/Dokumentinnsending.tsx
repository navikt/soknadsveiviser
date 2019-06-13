import * as React from "react";
import { Soknadsobjekt } from "../../../typer/soknad";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import SettValgtSoknadsobjekt from "./SettValgtSoknadsobjekt";
import { hentUrl } from "../../../utils/hentUrl";

interface Props {
  soknadsobjekt: Soknadsobjekt;
}

type MergedProps = Props & InjectedIntlProps & RouteComponentProps;
const Dokumentinnsending = (props: MergedProps) => {
  const { soknadsobjekt, match } = props;
  const { hovedskjema } = soknadsobjekt;

  return (
      <SettValgtSoknadsobjekt
          to={`${hentUrl(match.url)}/${hovedskjema.skjemanummer}/dokumentinnsending`}
          title="vissoknadsobjekter.knapp.dokumentinnsending"
          soknadsobjekt={soknadsobjekt}
          styling="knapp knapp--hoved"
      />
  );
};

export default injectIntl(withRouter(Dokumentinnsending));
