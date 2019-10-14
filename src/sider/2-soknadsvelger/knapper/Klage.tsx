import * as React from "react";
import { Soknadsobjekt } from "../../../typer/soknad";
import SettValgtSoknadsobjekt from "./SettValgtSoknadsobjekt";
import { withRouter, RouteComponentProps } from "react-router";
import { hentUrl } from "../../../utils/hentUrl";

interface Props {
  soknadsobjekt: Soknadsobjekt;
}

type MergedProps = Props & RouteComponentProps;
const Soknad = (props: MergedProps) => {
  const { soknadsobjekt, match } = props;
  const { skjemanummer } = soknadsobjekt.hovedskjema;

  return (
    <SettValgtSoknadsobjekt
      to={`${hentUrl(match.url)}/${skjemanummer}/brev/klage-eller-anke`}
      title="klageanke.knapp"
      soknadsobjekt={soknadsobjekt}
    />
  );
};

export default withRouter(Soknad);
