import * as React from "react";
import { Soknadsobjekt } from "../../../typer/soknad";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";

interface Props {
  soknadsobjekt: Soknadsobjekt;
}

type MergedProps = Props & InjectedIntlProps;
const FyllUtPapir = (props: MergedProps) => {
  const { soknadsobjekt, intl } = props;
  const fyllUtUrl = soknadsobjekt.digitalinnsending?.fyllUt?.lenker[intl.locale] || undefined;
  const tittel = "vissoknadsobjekter.fyllUt";

  return (
    <a className={"lenke soknadsobjekt__lenke typo-normal"} href={fyllUtUrl}>
      <FormattedMessage id={tittel} />
    </a>
  );
};

export default injectIntl(FyllUtPapir);
