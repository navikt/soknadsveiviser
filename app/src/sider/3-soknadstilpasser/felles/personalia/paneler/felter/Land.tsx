import * as React from "react";
import { Input } from "nav-frontend-skjema";
import { injectIntl } from "react-intl";
import { FieldProps } from "formik";
import {
  Personalia,
  medPersonalia
} from "../../../../../../states/providers/Personalia";
import { InjectedIntlProps } from "react-intl";

interface Fields {
  postnummer?: string;
}

type MergedProps = FieldProps<Fields> & Personalia & InjectedIntlProps;
const Land = (props: MergedProps) => {
  const { intl, field, touched, settTouched } = props;
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

export default medPersonalia(injectIntl(Land));
