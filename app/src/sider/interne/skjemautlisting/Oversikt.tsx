import * as React from "react";
import {
  apiKallAlleEESSISkjemaer,
  apiKallAlleSkjemaer
} from "../../../klienter/sanityKlient";
import Skjematabell from "./Tabell";
import Hovedbanner from "../../../komponenter/bannere/Hovedbanner";
import { Skjema } from "../../../typer/skjemaogvedlegg";
import PanelBase from "nav-frontend-paneler";
import { RouteComponentProps } from "react-router";
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl";
import Lenkepanel from "nav-frontend-lenkepanel/lib";

interface State {
  skjemaer: Skjema[];
}

type Props = RouteComponentProps<{ skjematype?: string }> & InjectedIntlProps;

class SkjemautlistingOversikt extends React.Component<Props, State> {
  componentDidMount(): void {
    this.hentSkjemaer();
  }

  componentDidUpdate(prevProps: RouteComponentProps<{ skjematype?: string }>) {
    // Typical usage (don't forget to compare props):
    if (
      this.props.match.params.skjematype !== prevProps.match.params.skjematype
    ) {
      this.hentSkjemaer();
    }
  }

  hentSkjemaer = () => {
    console.log("HENTER SKJEMAER!");
    if (this.props.match.params.skjematype === "skjema") {
      apiKallAlleSkjemaer().then((sanityData: Skjema[]) => {
        this.setState({ skjemaer: sanityData });
      });
    } else {
      apiKallAlleEESSISkjemaer().then((sanityData: Skjema[]) => {
        this.setState({ skjemaer: sanityData });
      });
    }
  };

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

  render = () => {
    const { intl, match } = this.props;
    const { skjematype } = match.params;
    const lenketil = skjematype === "skjema" ? "sed" : "skjema";
    return (
      <div className="side__wrapper">
        <div className="skjemautlisting__container">
          <Hovedbanner
            tittel={intl.formatMessage({
              id: "skjemautlisting.lenketil." + skjematype
            })}
            undertittel={intl.formatMessage({
              id: "skjemautlisting"
            })}
          />
          <PanelBase>
            <div className="skjemautlisting__lenkepaneler">
              <Lenkepanel tittelProps="element" href={lenketil} border={true}>
                <FormattedMessage id={"skjemautlisting.lenketil." + lenketil} />
              </Lenkepanel>
              <Lenkepanel
                className="skjemautlisting__lenkepanel"
                tittelProps="element"
                href="detaljert"
                border={true}
              >
                <FormattedMessage id="skjemautlisting.lenketil.detaljert" />
              </Lenkepanel>
            </div>
            {this.state
              ? this.grupperEmneordOgSkjemaer(this.state.skjemaer)
              : null}
          </PanelBase>
        </div>
      </div>
    );
  };
}

export default injectIntl(SkjemautlistingOversikt);
