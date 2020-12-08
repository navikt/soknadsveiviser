import * as React from "react";
import { Soknadsobjekt } from "../../../typer/soknad";
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl";

interface Props {
  soknadsobjekt: Soknadsobjekt;
}

const FyllUt = (props: Props & InjectedIntlProps) => {
  const { soknadsobjekt, intl } = props;
  const { digitalinnsending } = soknadsobjekt;
  const { hovedskjema } = soknadsobjekt;

  const fyllUtUrl = (((digitalinnsending || {}).fyllUt || {})
      .lenker || {})[intl.locale] || null;


  return fyllUtUrl ? (
    <>
      <a
        id={hovedskjema.skjemanummer}
        href={fyllUtUrl}
        className="knapp knapp--hoved"
      >
        <FormattedMessage id="vissoknadsobjekter.knapp.fyllut" />
      </a>
    </>
  ) : null;
};

export default injectIntl(FyllUt);
