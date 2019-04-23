import * as React from "react";
import { Soknadsobjekt } from "../../../typer/soknad";
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl";

interface Props {
  soknadsobjekt: Soknadsobjekt;
}

const Soknadsdialog = (props: Props & InjectedIntlProps) => {
  const { soknadsobjekt, intl } = props;
  const { digitalinnsending } = soknadsobjekt;
  const { hovedskjema } = soknadsobjekt;

  const soknadsdialogURL =
    (((digitalinnsending || {}).inngangtilsoknadsdialog || {})
      .soknadsdialogURL || {})[intl.locale] || null;

  return soknadsdialogURL ? (
    <>
      <a
        id={hovedskjema.skjemanummer}
        href={soknadsdialogURL}
        className="knapp knapp--hoved"
      >
        <FormattedMessage id="vissoknadsobjekter.knapp.soknadsdialog" />
      </a>
    </>
  ) : null;
};

export default injectIntl(Soknadsdialog);
