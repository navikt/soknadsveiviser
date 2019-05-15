import * as React from "react";
import { apiKallAlleSkjemaer } from "../../../klienter/sanityKlient";
import Skjematabell from "./Tabell";
import Hovedbanner from "../../../komponenter/bannere/Hovedbanner";
import { Skjema } from "../../../typer/skjemaogvedlegg";
import PanelBase from "nav-frontend-paneler";

interface State {
  skjemaer: Skjema[];
}

class SkjemautlistingOversikt extends React.Component<{}, State> {
  componentWillMount = () =>
    apiKallAlleSkjemaer().then((sanityData: Skjema[]) => {
      this.setState({ skjemaer: sanityData });
    });

  grupperEmneordOgSkjemaer = (skjemaer: Skjema[]) => {
    let emneordMedSkjemaer: { [emneord: string]: Skjema[] } = {};
    const skjemaUtenEmneord = "Skjemaer uten emneord";

    skjemaer.map(skjema =>
      skjema.emneord
        ? skjema.emneord.map(emneord =>
            !emneordMedSkjemaer.hasOwnProperty(emneord.emneord)
              ? (emneordMedSkjemaer[emneord.emneord] = [skjema])
              : emneordMedSkjemaer[emneord.emneord].push(skjema)
          )
        : !emneordMedSkjemaer.hasOwnProperty(skjemaUtenEmneord)
        ? (emneordMedSkjemaer[skjemaUtenEmneord] = [skjema])
        : emneordMedSkjemaer[skjemaUtenEmneord].push(skjema)
    );

    return <Skjematabell data={emneordMedSkjemaer} />;
  };

  render = () =>
    this.state ? (
      <div className="side__wrapper">
        <div className="skjemautlisting__container">
          <Hovedbanner tittel="Skjemautlisting" undertittel="Oversikt" />
          <PanelBase>
            {this.grupperEmneordOgSkjemaer(this.state.skjemaer)}
          </PanelBase>
        </div>
      </div>
    ) : null;
}

export default SkjemautlistingOversikt;
