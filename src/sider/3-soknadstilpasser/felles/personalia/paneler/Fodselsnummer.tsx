import * as React from "react";
import { Field, FieldProps } from "formik";
import FodselsnummerFelter from "./felter/Fodselsnummer";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { InjectedIntlProps, injectIntl } from "react-intl";
import BrukerVelgerEnhet from "./BrukerVelgerEnhet";
import {
  Fodselsnummer,
  medPersonalia,
  Personalia
} from "../../../../../states/providers/Personalia";
import {
  medValgtSoknadsobjekt,
  ValgtSoknad
} from "../../../../../states/providers/ValgtSoknadsobjekt";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import {
  finnesVisEnheter,
  finnesTilSkanning,
  finnesSpesifisertAdresse
} from "../../../../../utils/soknadsobjekter";

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
  const visEnheter = finnesVisEnheter(intl.locale, innsendingsmate);
  const skalTilSkanning = finnesTilSkanning(innsendingsmate);
  const skalTilSpesifisertAdresse = finnesSpesifisertAdresse(innsendingsmate);
  const skalTilValgtEnhet =
    !skalTilSkanning && !skalTilSpesifisertAdresse && visEnheter;

  const personHarFodselsnummerTekst = () =>
    personEllerBedrift === "bedrift"
      ? "personalia.bedrift.oppgiFodselsnummerDnummer"
      : "personalia.oppgiFodselsnummerDnummer";

  return (
    <Field
      name="fodselsnummer"
      label="Fodselsnummer"
      render={(pr: FieldProps<Fodselsnummer>) => (
        <Ekspanderbartpanel
          tittelProps="normaltekst"
          apen={personEllerBedrift !== "bedrift"}
          tittel={intl.formatMessage({ id: personHarFodselsnummerTekst() })}
        >
          <FodselsnummerFelter {...pr} />
          {skalTilValgtEnhet && (
            <BrukerVelgerEnhet
              beskrivelse={innsendingsmate.visenheter!}
              {...pr}
            />
          )}
        </Ekspanderbartpanel>
      )}
    />
  );
};

export default medValgtSoknadsobjekt(
  injectIntl(withRouter(medPersonalia(FodselsnummerPanel)))
);
