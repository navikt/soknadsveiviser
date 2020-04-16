import * as React from "react";
import { Input } from "nav-frontend-skjema";
import { injectIntl, FormattedMessage } from "react-intl";
import { FieldProps } from "formik";
import { Personalia, medPersonalia } from "../../../../../../states/providers/Personalia";
import { InjectedIntlProps } from "react-intl";

interface Fields {
  sted?: string;
}

type MergedProps = FieldProps<Fields> & Personalia & InjectedIntlProps;
const Poststed = (props: MergedProps) => {
  const { intl, field, settTouched, touched } = props;
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
            ? <FormattedMessage id="personalia.error.sted" />
            : undefined
          : undefined
      }
      autoComplete="address-level2"
    />
  );
};

export default medPersonalia(injectIntl(Poststed));
