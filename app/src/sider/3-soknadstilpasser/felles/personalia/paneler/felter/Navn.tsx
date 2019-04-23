import * as React from "react";
import { Input } from "nav-frontend-skjema";
import { injectIntl } from "react-intl";
import { FieldProps } from "formik";
import { PersonaliaKontekst } from "../../../../../../states/providers/Personalia";
import { InjectedIntlProps } from "react-intl";

interface Fields {
  navn: string;
}

interface Props {
  context: PersonaliaKontekst;
}

type MergedProps = FieldProps<Fields> & Props & InjectedIntlProps;
const Navn = (props: MergedProps) => {
  const { intl, field, context } = props;
  const { touched, settTouched } = context;
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
            ? {
                feilmelding: intl.formatMessage({ id: "personalia.error.name" })
              }
            : undefined
          : undefined
      }
    />
  );
};

export default injectIntl(Navn);
