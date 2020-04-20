import * as React from "react";
import { Input } from "nav-frontend-skjema";
import { injectIntl, FormattedMessage } from "react-intl";
import { FieldProps } from "formik";
import {
  Personalia,
  medPersonalia
} from "../../../../../../states/providers/Personalia";
import { InjectedIntlProps } from "react-intl";

interface Fields {
  navn: string;
}

type MergedProps = FieldProps<Fields> & Personalia & InjectedIntlProps;
const Navn = (props: MergedProps) => {
  const { intl, field, touched, settTouched } = props;
  return (
    <Input
      bredde="XXL"
      maxLength={60}
      name="adresse.navn"
      label={intl.formatMessage({ id: "personalia.label.navn" })}
      value={field.value.navn || ""}
      onChange={field.onChange}
      onBlur={() => settTouched({ ...touched, navn: true })}
      feil={
        !field.value.navn
          ? touched.navn
            ? <FormattedMessage id="personalia.error.name" />
            : undefined
          : undefined
      }
      autoComplete="name"
    />
  );
};

export default medPersonalia(injectIntl(Navn));
