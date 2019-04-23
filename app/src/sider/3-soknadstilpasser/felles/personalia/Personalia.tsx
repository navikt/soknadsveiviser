import * as React from "react";
import {
  medPersonalia,
  PersonaliaKontekst
} from "../../../../states/providers/Personalia";
import { Form, Formik } from "formik";
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

interface Routes {
  personEllerBedrift: string;
}

interface Props {
  personaliaKontekst: PersonaliaKontekst;
}

type MergedProps = Props & RouteComponentProps<Routes> & InjectedIntlProps;
class Personalia extends React.Component<MergedProps> {
  handleSubmit = (e: any) => {
    const { history, personaliaKontekst, match } = this.props;
    personaliaKontekst.resetState();
    if (erGyldigFodselsnummer(e.fodselsnummer)) {
      loggEvent("soknadsveiviser.harNorskFodselsnummer", {
        harNorskFodselsNummer: true
      });
      personaliaKontekst.settFodselsnummer(e.fodselsnummer);
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
      personaliaKontekst.settAdresse({
        navn: e.adresse.navn,
        adresse: e.adresse.adresse,
        sted: e.adresse.sted,
        land: e.adresse.land,
        postnummer: e.adresse.postnummer,
        valgtEnhet: e.adresse.valgtEnhet
      });
      history.push(`${match.url}/avslutning`);
    } else if (e.flerepersoner.valgtEnhet) {
      personaliaKontekst.settValgtEnhet(
        e.flerepersoner.valgtEnhet,
        "flerepersoner"
      );
      history.push(`${match.url}/avslutning`);
    } else if (e.tiltaksbedrift.valgtEnhet) {
      personaliaKontekst.settValgtEnhet(
        e.tiltaksbedrift.valgtEnhet,
        "tiltaksbedrift"
      );
      history.push(`${match.url}/avslutning`);
    } else {
      personaliaKontekst.settTouched({
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
    const { personaliaKontekst } = this.props;
    const { personEllerBedrift } = this.props.match.params;

    const initAdresse = personaliaKontekst.adresse || {
      navn: "",
      land: "",
      adresse: "",
      postnummer: "",
      sted: ""
    };

    const initValues = {
      fodselsnummer: personaliaKontekst.fodselsnummer || "",
      adresse: initAdresse,
      flerepersoner: {},
      tiltaksbedrift: {}
    };

    const overskrift = () =>
      personEllerBedrift === "bedrift"
        ? "personalia.bedrift.undertittel"
        : "personalia.undertittel";

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
                <FodselsnummerPanel {...this.props} />
                <AdressePanel {...this.props} />
                {personEllerBedrift === "bedrift" && (
                  <>
                    <FlerePersonerPanel {...this.props} />
                    <TiltaksBedriftPanel {...this.props} />
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

export default injectIntl(withRouter(medPersonalia(Personalia)));
