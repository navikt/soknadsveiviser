import * as React from "react";
import { Field, FieldProps } from "formik";
import AdresseFelter from "./AdresseFelter";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { Adresse, medPersonalia, Personalia } from "../../../../../states/providers/Personalia";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { Normaltekst } from "nav-frontend-typografi";

interface Routes {
  personEllerBedrift: string;
}

type MergedProps = Personalia & RouteComponentProps<Routes> & InjectedIntlProps;

const FodselsnummerPanel = (props: MergedProps) => {
  const { intl } = props;
  const { personEllerBedrift } = props.match.params;

  const personHarIkkeFodselsnummerTekst = () =>
    personEllerBedrift === "bedrift"
      ? "personalia.bedrift.ikkeFodselsnummerDnummer"
      : "personalia.ikkeFodselsnummerDnummer";

  return (
    <Ekspanderbartpanel
      tittel={<Normaltekst>{intl.formatMessage({ id: personHarIkkeFodselsnummerTekst() })}</Normaltekst>}
    >
      <Field name="adresse" label="Adresse" render={(pr: FieldProps<Adresse>) => <AdresseFelter {...pr} />} />
    </Ekspanderbartpanel>
  );
};

export default injectIntl(withRouter(medPersonalia(FodselsnummerPanel)));
