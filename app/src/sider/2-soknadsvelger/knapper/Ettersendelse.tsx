import * as React from "react";
import { Soknadsobjekt } from "../../../typer/soknad";
import SettValgtSoknadsobjekt from "./SettValgtSoknadsobjekt";
import { withRouter, RouteComponentProps } from "react-router";

interface Props {
  soknadsobjekt: Soknadsobjekt;
}

type MergedProps = Props & RouteComponentProps;
const Ettersendelse = (props: MergedProps) => {
  const { soknadsobjekt, match } = props;
  const { skjemanummer } = soknadsobjekt.hovedskjema;

  return (
    <SettValgtSoknadsobjekt
      to={`${match.url}/${skjemanummer}/ettersendelse`}
      title="ettersendelser.knapp"
      soknadsobjekt={soknadsobjekt}
    />
  );
};

export default withRouter(Ettersendelse);
