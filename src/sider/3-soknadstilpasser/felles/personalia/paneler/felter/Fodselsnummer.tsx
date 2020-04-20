import * as React from "react";
import { erGyldigFodselsnummer } from "../../../../../../utils/validering/fodselsnummer";
import Input from "nav-frontend-skjema/lib/input";
import NavFrontendSpinner from "nav-frontend-spinner";
import { injectIntl, FormattedMessage } from "react-intl";
import { FieldProps } from "formik";
import { Personalia, medPersonalia } from "../../../../../../states/providers/Personalia";
import { InjectedIntlProps } from "react-intl";

interface Fields {
  fodselsnummer: string;
}

type MergedProps = FieldProps<Fields> & Personalia & InjectedIntlProps;
const Fodselsnummer = (props: MergedProps) => {
  const { touched, settTouched, intl, field } = props;
  return touched ? (
    <Input
      className="litenavstand"
      bredde="S"
      name="fodselsnummer.fodselsnummer"
      label={intl.formatMessage({ id: "personalia.label.fodselsnummer" })}
      value={field.value.fodselsnummer || ""}
      onChange={field.onChange}
      feil={
        touched.fodselsnummer &&
        (!field.value.fodselsnummer || !erGyldigFodselsnummer(field.value.fodselsnummer)) && (
          <FormattedMessage id="personalia.error.fodselsnummer" />
        )
      }
      onBlur={() => settTouched({ ...touched, fodselsnummer: true })}
      inputMode="numeric"
    />
  ) : (
    <NavFrontendSpinner type="XL" />
  );
};

export default medPersonalia(injectIntl(Fodselsnummer));
