import * as React from "react";
import { Field, FieldProps } from "formik";
import FodselsnummerFelter from "./felter/Fodselsnummer";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { InjectedIntlProps, injectIntl } from "react-intl";
import BrukerVelgerEnhet from "./BrukerVelgerEnhet";
import {
  medPersonalia,
  Personalia
} from "../../../../../states/providers/Personalia";
import {
  medValgtSoknadsobjekt,
  ValgtSoknad
} from "../../../../../states/providers/ValgtSoknadsobjekt";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";

interface Routes {
  personEllerBedrift: string;
}

type MergedProps = ValgtSoknad &
  Personalia &
  RouteComponentProps<Routes> &
  InjectedIntlProps;

const FodselsnummerPanel = (props: MergedProps) => {
  const { intl, valgtSoknadsobjekt } = props;
  const { personEllerBedrift } = props.match.params;
  const { innsendingsmate } = valgtSoknadsobjekt;

  const personHarFodselsnummerTekst = () =>
    personEllerBedrift === "bedrift"
      ? "personalia.bedrift.oppgiFodselsnummerDnummer"
      : "personalia.oppgiFodselsnummerDnummer";

  return (
    <Field
      name="fodselsnummer"
      label="Fodselsnummer"
      render={(
        pr: FieldProps<{ fodselsnummer: string }> & InjectedIntlProps
      ) => (
        <Ekspanderbartpanel
          tittel={intl.formatMessage({
            id: personHarFodselsnummerTekst()
          })}
          tittelProps="normaltekst"
          apen={personEllerBedrift !== "bedrift"}
        >
          <FodselsnummerFelter {...pr} />
          {innsendingsmate && innsendingsmate.visenheter && (
            <BrukerVelgerEnhet beskrivelse={innsendingsmate.visenheter} />
          )}
        </Ekspanderbartpanel>
      )}
    />
  );
};

export default medValgtSoknadsobjekt(
  injectIntl(withRouter(medPersonalia(FodselsnummerPanel)))
);
