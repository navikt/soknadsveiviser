import * as React from "react";
import { apiKallAlleSkjemaer } from "../../../klienter/sanityKlient";
import Skjematabell from "./Tabell";
import { Skjema } from "../../4-avslutning/steg/SkjemaVisning";
import Wrapper from "../../../komponenter/wrapper/Wrapper";
import Hovedbanner from "../../../komponenter/bannere/Hovedbanner";

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
      <Wrapper>
        <Hovedbanner tittel="Skjemautlisting" undertittel="Oversikt" />
        <div className="innhold">
          {this.grupperEmneordOgSkjemaer(this.state.skjemaer)}
        </div>
      </Wrapper>
    ) : null;
}

export default SkjemautlistingOversikt;
