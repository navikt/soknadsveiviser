import * as React from "react";
import { Field, FieldProps } from "formik";
import AdresseFelter from "./AdresseFelter";
import BrukerVelgerEnhet from "./BrukerVelgerEnhet";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { InjectedIntlProps, injectIntl } from "react-intl";
import {
  Adresse,
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
        render={(pr: FieldProps<Adresse>) => <AdresseFelter {...pr} />}
      />
      {innsendingsmate && innsendingsmate.visenheter && (
        <BrukerVelgerEnhet beskrivelse={innsendingsmate.visenheter} />
      )}
    </Ekspanderbartpanel>
  );
};

export default medValgtSoknadsobjekt(
  injectIntl(withRouter(medPersonalia(FodselsnummerPanel)))
);
