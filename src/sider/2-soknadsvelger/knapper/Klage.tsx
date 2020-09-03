import * as React from "react";
import { Soknadsobjekt } from "../../../typer/soknad";
import SettValgtSoknadsobjekt from "./SettValgtSoknadsobjekt";
import { withRouter, RouteComponentProps } from "react-router";
import { hentUrl } from "../../../utils/hentUrl";
import { kanKlage } from "../../../utils/kanKlage";

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

  return kanKlage(soknadsobjekt.klageAnke, personEllerBedrift) ? (
    <SettValgtSoknadsobjekt
      to={`${hentUrl(match.url)}/${skjemanummer}/klage-eller-anke/brev`}
      title="klageanke.knapp"
      soknadsobjekt={soknadsobjekt}
    />
  ) : null;
};

export default withRouter(Soknad);
