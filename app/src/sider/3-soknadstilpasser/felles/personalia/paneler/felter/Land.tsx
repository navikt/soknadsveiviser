import * as React from "react";
import { Input } from "nav-frontend-skjema";
import { injectIntl } from "react-intl";
import { FieldProps } from "formik";
import { PersonaliaKontekst } from "../../../../../../states/providers/Personalia";
import { InjectedIntlProps } from "react-intl";

interface Fields {
  postnummer?: string;
}

interface Props {
  context: PersonaliaKontekst;
}

type MergedProps = FieldProps<Fields> & Props & InjectedIntlProps;
const Land = (props: MergedProps) => {
  const { intl, field, context } = props;
  const { touched, settTouched } = context;
  return (
    <Input
      bredde="XL"
      maxLength={40}
      name="adresse.land"
      label={intl.formatMessage({ id: "personalia.label.land" })}
      value={field.value.land || ""}
      onChange={field.onChange}
      onBlur={() => settTouched({ ...touched, land: true })}
      feil={
        !field.value.land
          ? touched.land
            ? {
                feilmelding: intl.formatMessage({
                  id: "personalia.error.land"
                })
              }
            : undefined
          : undefined
      }
    />
  );
};

export default injectIntl(Land);
