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
const Poststed = (props: MergedProps) => {
  const { intl, field, context } = props;
  const { settTouched, touched } = context;
  return (
    <Input
      bredde="XL"
      maxLength={35}
      name="adresse.sted"
      label={intl.formatMessage({ id: "personalia.label.poststed" })}
      value={field.value.sted || ""}
      onChange={field.onChange}
      onBlur={() => settTouched({ ...touched, sted: true })}
      feil={
        !field.value.sted
          ? touched.sted
            ? {
                feilmelding: intl.formatMessage({
                  id: "personalia.error.sted"
                })
              }
            : undefined
          : undefined
      }
    />
  );
};

export default injectIntl(Poststed);
