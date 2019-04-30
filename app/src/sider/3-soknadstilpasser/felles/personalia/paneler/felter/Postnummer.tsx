import * as React from "react";
import { Input } from "nav-frontend-skjema";
import { injectIntl } from "react-intl";
import { FieldProps } from "formik";
import { InjectedIntlProps } from "react-intl";

interface Fields {
  postnummer?: string;
}

type MergedProps = FieldProps<Fields> & InjectedIntlProps;
const Postnummer = (props: MergedProps) => {
  const { intl, field } = props;
  return (
    <Input
      bredde="S"
      label={intl.formatMessage({ id: "personalia.label.postnummer" })}
      maxLength={12}
      name="adresse.postnummer"
      value={field.value.postnummer || ""}
      onChange={field.onChange}
    />
  );
};

export default injectIntl(Postnummer);
