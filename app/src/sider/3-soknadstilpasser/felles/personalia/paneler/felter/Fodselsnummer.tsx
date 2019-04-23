import * as React from "react";
import { erGyldigFodselsnummer } from "../../../../../../utils/validering/fodselsnummer";
import Input from "nav-frontend-skjema/lib/input";
import NavFrontendSpinner from "nav-frontend-spinner";
import { injectIntl, FormattedMessage } from "react-intl";
import UndertekstBold from "nav-frontend-typografi/lib/undertekst-bold";
import { FieldProps } from "formik";
import { PersonaliaKontekst } from "../../../../../../states/providers/Personalia";
import { InjectedIntlProps } from "react-intl";

interface Fields {
  fodselsnummer: string;
}

interface Props {
  context: PersonaliaKontekst;
}

type MergedProps = FieldProps<Fields> & Props & InjectedIntlProps;
const Fodselsnummer = (props: MergedProps) => {
  const { context, intl, field } = props;
  const { touched, settTouched } = context;
  return touched ? (
    <>
      <UndertekstBold className="litenavstand">
        <FormattedMessage id={"personalia.undertekstbold.gdpr"} />
      </UndertekstBold>
      <Input
        className="litenavstand"
        bredde="S"
        name="fodselsnummer"
        label={intl.formatMessage({ id: "personalia.label.fodselsnummer" })}
        value={field.value}
        onChange={field.onChange}
        feil={
          !erGyldigFodselsnummer(field.value) && touched.fodselsnummer
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

export default injectIntl(Fodselsnummer);
