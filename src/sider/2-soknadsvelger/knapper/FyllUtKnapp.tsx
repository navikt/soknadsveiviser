import React from "react";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { Soknadsobjekt } from "../../../typer/soknad";

interface Props {
  soknadsobjekt: Soknadsobjekt;
}

const FyllUtKnapp = (props: Props & InjectedIntlProps) => {
  const { intl, soknadsobjekt } = props;
  const url =
    ((((soknadsobjekt || {}).digitalinnsending || {}).inngangtilsoknadsdialog || {}).soknadsdialogURL || {})[
      intl.locale
    ] || undefined;
  return (
    <a className="knapp knapp--hoved" href={url}>
      <FormattedMessage id="vissoknadsobjekter.knapp.fyllut" />
    </a>
  );
};

export default injectIntl(FyllUtKnapp);
