import * as React from "react";
import { Field, FieldProps } from "formik";
import AdresseFelter from "./AdresseFelter";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { InjectedIntlProps, injectIntl } from "react-intl";
import {
  Adresse,
  medPersonalia,
  PersonaliaKontekst
} from "../../../../../states/providers/Personalia";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";

interface Routes {
  personEllerBedrift: string;
}

interface Props {
  personaliaKontekst: PersonaliaKontekst;
}

type MergedProps = Props & RouteComponentProps<Routes> & InjectedIntlProps;
const FodselsnummerPanel = (props: MergedProps) => {
  const { intl, personaliaKontekst } = props;
  const { personEllerBedrift } = props.match.params;

  const personHarIkkeFodselsnummerTekst = () =>
    personEllerBedrift === "bedrift"
      ? "personalia.bedrift.ikkeFodselsnummerDnummer"
      : "personalia.ikkeFodselsnummerDnummer";

  return (
    <Ekspanderbartpanel
      tittel={intl.formatMessage({ id: personHarIkkeFodselsnummerTekst() })}
      tittelProps="normaltekst"
    >
      <Field
        name="adresse"
        label="Adresse"
        render={(pr: FieldProps<Adresse>) => (
          <AdresseFelter context={personaliaKontekst} {...pr} />
        )}
      />
    </Ekspanderbartpanel>
  );
};

export default injectIntl(withRouter(medPersonalia(FodselsnummerPanel)));
