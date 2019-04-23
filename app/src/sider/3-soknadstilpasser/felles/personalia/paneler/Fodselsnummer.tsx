import * as React from "react";
import { Field, FieldProps } from "formik";
import FodselsnummerFelter from "./felter/Fodselsnummer";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { InjectedIntlProps, injectIntl } from "react-intl";
import {
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

  const personHarFodselsnummerTekst = () =>
    personEllerBedrift === "bedrift"
      ? "personalia.bedrift.oppgiFodselsnummerDnummer"
      : "personalia.oppgiFodselsnummerDnummer";

  return (
    <Field
      name="fodselsnummer"
      label="Fodselsnummer"
      render={(
        pr: FieldProps<{ fodselsnummer: string }> &
          PersonaliaKontekst &
          InjectedIntlProps
      ) => (
        <Ekspanderbartpanel
          tittel={intl.formatMessage({
            id: personHarFodselsnummerTekst()
          })}
          tittelProps="normaltekst"
          apen={personEllerBedrift !== "bedrift"}
        >
          <FodselsnummerFelter context={personaliaKontekst} {...pr} />
        </Ekspanderbartpanel>
      )}
    />
  );
};

export default injectIntl(withRouter(medPersonalia(FodselsnummerPanel)));
