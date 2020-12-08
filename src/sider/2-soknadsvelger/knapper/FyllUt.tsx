import * as React from "react";
import { Soknadsobjekt } from "../../../typer/soknad";
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl";

interface Props {
  soknadsobjekt: Soknadsobjekt;
}

const FyllUt = (props: Props & InjectedIntlProps) => {
  const { soknadsobjekt, intl } = props;
  const fyllUtUrl = soknadsobjekt.digitalinnsending?.fyllUt?.lenker[intl.locale] || undefined;
  const tittel = "vissoknadsobjekter.knapp.fyllut";
  const { hovedskjema } = soknadsobjekt;

  return fyllUtUrl ? (
    <a id={hovedskjema.skjemanummer} href={fyllUtUrl} className="knapp knapp--hoved">
      <FormattedMessage id={tittel} />
    </a>
  ) : null;
};

export default injectIntl(FyllUt);
