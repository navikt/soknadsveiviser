import * as React from "react";
import { Soknadsobjekt } from "../../../typer/soknad";
import SettValgtSoknadsobjekt from "./SettValgtSoknadsobjekt";
import { withRouter, RouteComponentProps } from "react-router";
import { hentUrl } from "../../../utils/hentUrl";

interface Props {
  soknadsobjekt: Soknadsobjekt;
}

interface Routes {
  personEllerBedrift: string;
}

type MergedProps = Props & RouteComponentProps<Routes>;
const Soknad = (props: MergedProps) => {
  const { soknadsobjekt, match } = props;
  const { skjemanummer } = soknadsobjekt.hovedskjema;
  const { personEllerBedrift } = match.params;
  return personEllerBedrift !== "bedrift" ? (
    <SettValgtSoknadsobjekt
      to={`${hentUrl(match.url)}/${skjemanummer}/brev/klage-eller-anke`}
      title="klageanke.knapp"
      soknadsobjekt={soknadsobjekt}
    />
  ) : null;
};

export default withRouter(Soknad);
