import * as React from "react";
import { apiKallAlleSEDSkjemaer, apiKallAlleSkjemaer } from "../../../klienter/sanityKlient";
import Hovedbanner from "../../../komponenter/bannere/Hovedbanner";
import { Skjema } from "../../../typer/skjemaogvedlegg";
import PanelBase from "nav-frontend-paneler";
import { RouteComponentProps } from "react-router";
import { injectIntl, InjectedIntlProps, FormattedMessage, FormattedHTMLMessage } from "react-intl";
import Lenkepanel from "nav-frontend-lenkepanel/lib";
import Oversiktstabell from "./tabeller/Oversiktstabell";
import Spinner from "../../../komponenter/spinner/Spinner";
import { Element, Ingress } from "nav-frontend-typografi";
import Helmet from "react-helmet";
import Lenke from "nav-frontend-lenker";

interface State {
  skjemaer: Skjema[];
}

type Props = RouteComponentProps<{ skjematype?: string }> & InjectedIntlProps;

class SkjemautlistingOversikt extends React.Component<Props, State> {
  componentDidMount(): void {
    this.hentSkjemaer();
  }

  componentDidUpdate(prevProps: RouteComponentProps<{ skjematype?: string }>) {
    if (this.props.match.params.skjematype !== prevProps.match.params.skjematype) {
      this.hentSkjemaer();
    }
  }

  hentSkjemaer = () => {
    if (this.props.match.params.skjematype === "skjema") {
      apiKallAlleSkjemaer().then((sanityData: Skjema[]) => {
        this.setState({ skjemaer: sanityData });
      });
    } else {
      apiKallAlleSEDSkjemaer().then((sanityData: Skjema[]) => {
        this.setState({ skjemaer: sanityData });
      });
    }
  };

  render = () => {
    const { intl, match } = this.props;
    const { skjematype } = match.params;
    const lenketil = skjematype === "skjema" ? "sed" : "skjema";
    return (
      <div className="side__wrapper">
        <Helmet>
          <title>
            {intl.formatMessage({
              id: "skjemautlisting.lenketil." + skjematype,
            })}
          </title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="skjemautlisting__container">
          <Hovedbanner
            tittel={intl.formatMessage({
              id: "skjemautlisting.lenketil." + skjematype,
            })}
            undertittel={intl.formatMessage({
              id: "skjemautlisting",
            })}
          />
          <PanelBase>
            <div className="skjemautlisting__paneler">
              <Lenkepanel tittelProps="element" href={lenketil} border={true}>
                <FormattedMessage id={"skjemautlisting.lenketil." + lenketil} />
              </Lenkepanel>
              <Lenkepanel className="skjemautlisting__lenkepanel" tittelProps="element" href="detaljert" border={true}>
                <FormattedMessage id="skjemautlisting.lenketil.detaljert" />
              </Lenkepanel>
            </div>
            {skjematype === "sed" && (
              <Ingress className="skjemautlisting__litenmargin-overunder">
                <FormattedHTMLMessage id="skjemautlisting.sed.forklaring" />
              </Ingress>
            )}
            {this.state ? <Oversiktstabell skjemaer={this.state.skjemaer} /> : <Spinner />}
          </PanelBase>
        </div>
      </div>
    );
  };
}

export default injectIntl(SkjemautlistingOversikt);
