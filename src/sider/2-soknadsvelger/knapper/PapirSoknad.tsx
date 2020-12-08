import * as React from "react";
import { Soknadsobjekt } from "../../../typer/soknad";
import SettValgtSoknadsobjekt from "./SettValgtSoknadsobjekt";
import { withRouter, RouteComponentProps } from "react-router";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { finnesDigitalInnsending } from "../../../utils/soknadsobjekter";
import { hentUrl } from "../../../utils/hentUrl";

interface Props {
  soknadsobjekt: Soknadsobjekt;
}

type MergedProps = Props & RouteComponentProps & InjectedIntlProps;
const Soknad = (props: MergedProps) => {
  const { soknadsobjekt, match, intl } = props;
  const { skjemanummer } = soknadsobjekt.hovedskjema;
  const digitalInnsending = finnesDigitalInnsending(soknadsobjekt, intl.locale);

  const tittel = digitalInnsending ? "vissoknadsobjekter.ikkeelektroniskID" : "vissoknadsobjekter.knapp.soknadpapapir";

  const lenkeEllerKnapp = digitalInnsending
    ? "lenke soknadsobjekt__lenke typo-normal"
    : "knapp knapp--hoved soknadsobjekt__knapp";

  return (
    <SettValgtSoknadsobjekt
      to={`${hentUrl(match.url)}/${skjemanummer}/brev`}
      title={tittel}
      soknadsobjekt={soknadsobjekt}
      styling={lenkeEllerKnapp}
    />
  );
};

export default injectIntl(withRouter(Soknad));
