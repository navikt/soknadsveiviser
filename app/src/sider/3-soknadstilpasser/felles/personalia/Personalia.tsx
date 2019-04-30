import React, { Component } from "react";
import {
  medPersonalia,
  Personalia
} from "../../../../states/providers/Personalia";
import { medValgtSoknadsobjekt } from "../../../../states/providers/ValgtSoknadsobjekt";
import { Form, Formik } from "formik";
import { Soknadsobjekt } from "../../../../typer/soknad";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { erGyldigFodselsnummer } from "../../../../utils/validering/fodselsnummer";
import { Undertittel } from "nav-frontend-typografi";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { loggEvent } from "../../../../utils/logger";
import FodselsnummerPanel from "./paneler/Fodselsnummer";
import AdressePanel from "./paneler/AdressePanel";
import FlerePersonerPanel from "./paneler/FlerePersoner";
import TiltaksBedriftPanel from "./paneler/TiltaksBedrift";
import NesteKnapp from "./knapper/Neste";

interface ValgtSoknad {
  valgtSoknadsobjekt: Soknadsobjekt;
  klageSoknadsobjekt: Soknadsobjekt;
}

interface Routes {
  personEllerBedrift: string;
}

type MergedProps = ValgtSoknad &
  Personalia &
  RouteComponentProps<Routes> &
  InjectedIntlProps;

class VisPersonalia extends Component<MergedProps> {
  handleSubmit = (e: any) => {
    const { history, match } = this.props;
    this.props.resetState();
    if (erGyldigFodselsnummer(e.fodselsnummer)) {
      loggEvent("soknadsveiviser.harNorskFodselsnummer", {
        harNorskFodselsNummer: true
      });
      this.props.settFodselsnummer(e.fodselsnummer);
      history.push(`${match.url}/avslutning`);
    } else if (
      e.adresse.navn &&
      e.adresse.adresse &&
      e.adresse.sted &&
      e.adresse.land
    ) {
      loggEvent("soknadsveiviser.harNorskFodselsnummer", {
        harNorskFodselsNummer: false
      });
      this.props.settAdresse({
        navn: e.adresse.navn,
        adresse: e.adresse.adresse,
        sted: e.adresse.sted,
        land: e.adresse.land,
        postnummer: e.adresse.postnummer,
        valgtEnhet: e.adresse.valgtEnhet
      });
      history.push(`${match.url}/avslutning`);
    } else if (e.flerepersoner.valgtEnhet) {
      this.props.settValgtEnhet(e.flerepersoner.valgtEnhet, "flerepersoner");
      history.push(`${match.url}/avslutning`);
    } else if (e.tiltaksbedrift.valgtEnhet) {
      this.props.settValgtEnhet(e.tiltaksbedrift.valgtEnhet, "tiltaksbedrift");
      history.push(`${match.url}/avslutning`);
    } else {
      this.props.settTouched({
        fodselsnummer: true,
        navn: true,
        adresse: true,
        land: true,
        sted: true,
        valgtEnhet: true
      });
    }
  };

  render() {
    console.log(this.props);
    console.log("Rendering personalia");
    const { personEllerBedrift } = this.props.match.params;

    const initAdresse = this.props.adresse || {
      navn: "",
      land: "",
      adresse: "",
      postnummer: "",
      sted: ""
    };

    const initValues = {
      fodselsnummer: this.props.fodselsnummer || "",
      adresse: initAdresse,
      flerepersoner: {},
      tiltaksbedrift: {}
    };

    const overskrift = () =>
      personEllerBedrift === "bedrift"
        ? "personalia.bedrift.undertittel"
        : "personalia.undertittel";

    console.log();
    return (
      <Formik
        initialValues={initValues}
        onSubmit={this.handleSubmit}
        render={() => {
          return (
            <>
              <div className="sentrert personalia__tittel-wrapper">
                <Undertittel>
                  <FormattedMessage id={overskrift()} />
                </Undertittel>
              </div>
              <Form autoComplete="off" className="adressepaneler">
                <FodselsnummerPanel />
                <AdressePanel />
                {personEllerBedrift === "bedrift" && (
                  <>
                    <FlerePersonerPanel />
                    <TiltaksBedriftPanel />
                  </>
                )}
                <NesteKnapp />
              </Form>
            </>
          );
        }}
      />
    );
  }
}

export default medPersonalia<Personalia>(
  medValgtSoknadsobjekt<ValgtSoknad & Personalia>(
    injectIntl<ValgtSoknad & Personalia & InjectedIntlProps>(
      withRouter<
        ValgtSoknad &
          Personalia &
          InjectedIntlProps &
          RouteComponentProps<Routes>
      >(VisPersonalia)
    )
  )
);
