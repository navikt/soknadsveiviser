import * as React from "react";
import { Soknadsobjekt } from "../../../typer/soknad";
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl";

interface Props {
  soknadsobjekt: Soknadsobjekt;
}

const FyllUtPapir = (props: Props & InjectedIntlProps) => {
  const { soknadsobjekt, intl } = props;
  const fyllUtUrl = soknadsobjekt.digitalinnsending?.fyllUt?.lenker[intl.locale] || undefined;
  const tittel = "vissoknadsobjekter.fyllUt";

  return fyllUtUrl ? (
    <a className={"lenke soknadsobjekt__lenke typo-normal"} href={fyllUtUrl}>
      <FormattedMessage id={tittel} />
    </a>
  ) : null;
};

export default injectIntl(FyllUtPapir);
