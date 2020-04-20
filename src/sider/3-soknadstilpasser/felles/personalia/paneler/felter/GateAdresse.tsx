import * as React from "react";
import { Input } from "nav-frontend-skjema";
import { injectIntl, FormattedMessage } from "react-intl";
import { FieldProps } from "formik";
import { Personalia, medPersonalia } from "../../../../../../states/providers/Personalia";
import { InjectedIntlProps } from "react-intl";

interface Fields {
  adresse: string;
}

type MergedProps = FieldProps<Fields> & Personalia & InjectedIntlProps;
const GateAdresse = (props: MergedProps) => {
  const { intl, field, touched, settTouched } = props;
  return (
    <Input
      bredde="XXL"
      maxLength={60}
      name="adresse.adresse"
      label={intl.formatMessage({ id: "personalia.label.adresse" })}
      value={field.value.adresse || ""}
      onChange={field.onChange}
      onBlur={() => settTouched({ ...touched, adresse: true })}
      feil={
        !field.value.adresse ? (
          touched.adresse ? (
            <FormattedMessage id="personalia.error.adresse" />
          ) : undefined
        ) : undefined
      }
      autoComplete="street-address"
    />
  );
};

export default medPersonalia(injectIntl(GateAdresse));
