import * as React from "react";
import { Soknadsobjekt } from "../../../typer/soknad";
import SettValgtSoknadsobjekt from "./SettValgtSoknadsobjekt";
import { withRouter, RouteComponentProps } from "react-router";
import { InjectedIntlProps, injectIntl } from "react-intl";

interface Props {
  soknadsobjekt: Soknadsobjekt;
}

type MergedProps = Props & RouteComponentProps & InjectedIntlProps;
const Soknad = (props: MergedProps) => {
  const { soknadsobjekt, match, intl } = props;
  const { skjemanummer } = soknadsobjekt.hovedskjema;

  const finnesDigitalInnsending =
    soknadsobjekt.digitalinnsending &&
    (soknadsobjekt.digitalinnsending.dokumentinnsending ||
      (soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog &&
        soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog
          .soknadsdialogURL &&
        soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog
          .soknadsdialogURL[intl.locale]));

  const tittel = finnesDigitalInnsending
    ? "vissoknadsobjekter.ikkeelektroniskID"
    : "vissoknadsobjekter.knapp.soknadpapapir";

  const lenkeEllerKnapp = finnesDigitalInnsending
    ? "lenke soknadsobjekt__lenke typo-normal"
    : undefined;

  return (
    <SettValgtSoknadsobjekt
      to={`${match.url}/${skjemanummer}/brev`}
      title={tittel}
      soknadsobjekt={soknadsobjekt}
      style={lenkeEllerKnapp}
    />
  );
};

export default injectIntl(withRouter(Soknad));
