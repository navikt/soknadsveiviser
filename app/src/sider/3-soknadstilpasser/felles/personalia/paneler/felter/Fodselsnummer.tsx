import * as React from "react";
import { erGyldigFodselsnummer } from "../../../../../../utils/validering/fodselsnummer";
import Input from "nav-frontend-skjema/lib/input";
import NavFrontendSpinner from "nav-frontend-spinner";
import { injectIntl, FormattedMessage } from "react-intl";
import UndertekstBold from "nav-frontend-typografi/lib/undertekst-bold";
import { FieldProps } from "formik";
import {
  Personalia,
  medPersonalia
} from "../../../../../../states/providers/Personalia";
import { InjectedIntlProps } from "react-intl";

interface Fields {
  fodselsnummer: string;
}

type MergedProps = FieldProps<Fields> & Personalia & InjectedIntlProps;
const Fodselsnummer = (props: MergedProps) => {
  const { touched, settTouched, intl, field } = props;
  return touched ? (
    <>
      <UndertekstBold className="litenavstand">
        <FormattedMessage id={"personalia.undertekstbold.gdpr"} />
      </UndertekstBold>
      <Input
        className="litenavstand"
        bredde="S"
        name="fodselsnummer.fodselsnummer"
        label={intl.formatMessage({ id: "personalia.label.fodselsnummer" })}
        value={field.value.fodselsnummer || ""}
        onChange={field.onChange}
        feil={
          touched.fodselsnummer &&
          (!field.value.fodselsnummer ||
            !erGyldigFodselsnummer(field.value.fodselsnummer))
            ? {
                feilmelding: intl.formatMessage({
                  id: "personalia.error.fodselsnummer"
                })
              }
            : undefined
        }
        onBlur={() => settTouched({ ...touched, fodselsnummer: true })}
      />
    </>
  ) : (
    <NavFrontendSpinner type="XL" />
  );
};

export default medPersonalia(injectIntl(Fodselsnummer));
