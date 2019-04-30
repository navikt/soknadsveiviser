import React, { Component } from "react";
import AvslutningSoknad from "../4-avslutning/Soknad";
import AvslutningKlage from "../4-avslutning/Klage";
import MedPersonalia from "../../states/providers/Personalia";
import Wrapper from "../../komponenter/wrapper/Wrapper";
import { injectIntl, InjectedIntlProps } from "react-intl";
import Soknad from "./soknad/Soknad";
import Klage from "./klage/Klage";
import Ettersendelse from "./ettersendelse/Ettersendelse";
import Dokumentinnsending from "./Dokumentinnsending";
import MedValgtSoknadsobjekt from "../../states/providers/ValgtSoknadsobjekt";
import DigitalEllerPapirEttersendelse from "./ettersendelse/DigitalEllerPapirEttersendelse";
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter
} from "react-router-dom";

interface Routes {
  personEllerBedrift: string;
  kategori: string;
  underkategori: string;
}

interface Props {
  aktivtSteg: number;
  bannerTittel: string;
}

type MergedProps = Props & RouteComponentProps<Routes> & InjectedIntlProps;
class SkjemaVelgerRoutes extends Component<MergedProps> {
  state = {
    aktivtSteg: 0,
    bannerTittel: ""
  };

  settTittel = (tittel: string) =>
    this.setState({ ...this.state, bannerTittel: tittel });

  render = () => {
    const { path } = this.props.match;
    return (
      <Switch>
        <Wrapper>
          <MedValgtSoknadsobjekt>
            <MedPersonalia>
              <Route exact path={`${path}/brev`} component={Soknad} />
              <Route
                exact
                path={`${path}/brev/klage/:ettersendelse(ettersendelse)?`}
                component={Klage}
              />
              <Route
                exact
                path={`${path}/brev/klage/:ettersendelse(ettersendelse)?/avslutning`}
                render={props => <AvslutningKlage {...props} />}
              />
              <Route
                exact
                path={`${path}/brev/ettersendelse`}
                component={Ettersendelse}
              />
              <Route
                exact
                path={`${path}/brev/:ettersendelse(ettersendelse)?/avslutning`}
                render={props => <AvslutningSoknad {...props} />}
              />
              <Route
                exact
                path={`${path}/ettersendelse`}
                component={DigitalEllerPapirEttersendelse}
              />
              <Route
                exact
                path={`${path}/dokumentinnsending`}
                component={Dokumentinnsending}
              />
            </MedPersonalia>
          </MedValgtSoknadsobjekt>
        </Wrapper>
      </Switch>
    );
  };
}

export default withRouter(injectIntl(SkjemaVelgerRoutes));
