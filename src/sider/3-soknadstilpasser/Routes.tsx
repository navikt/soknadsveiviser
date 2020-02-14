import React, { Component } from "react";
import AvslutningAnke from "../4-avslutning/Anke";
import AvslutningSoknad from "../4-avslutning/Soknad";
import AvslutningKlage from "../4-avslutning/Klage";
import MedPersonalia from "../../states/providers/Personalia";
import Wrapper from "../../komponenter/wrapper/Wrapper";
import { injectIntl, InjectedIntlProps } from "react-intl";
import Klage from "./klageanke/Klage";
import Anke from "./klageanke/Anke";
import VelgKlageEllerAnke from "./klageanke/VelgKlageEllerAnke";
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
import PapirSoknad from "./soknad/PapirSoknad";

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
              <Route exact={true} path={`${path}/brev`} component={PapirSoknad} />
              <Route
                exact={true}
                path={`${path}/brev/klage-eller-anke`}
                component={VelgKlageEllerAnke}
              />
              <Route
                exact={true}
                path={`${path}/brev/klage/:ettersendelse(ettersendelse)?`}
                component={Klage}
              />
              <Route
                exact={true}
                path={`${path}/brev/anke/:ettersendelse(ettersendelse)?`}
                component={Anke}
              />
              <Route
                exact={true}
                path={`${path}/brev/klage/:ettersendelse(ettersendelse)?/avslutning`}
                render={props => <AvslutningKlage {...props} />}
              />
              <Route
                exact={true}
                path={`${path}/brev/anke/:ettersendelse(ettersendelse)?/avslutning`}
                render={props => <AvslutningAnke {...props} />}
              />
              <Route
                exact={true}
                path={`${path}/brev/ettersendelse`}
                component={Ettersendelse}
              />
              <Route
                exact={true}
                path={`${path}/brev/:ettersendelse(ettersendelse)?/avslutning`}
                render={props => <AvslutningSoknad {...props} />}
              />
              <Route
                exact={true}
                path={`${path}/ettersendelse`}
                component={DigitalEllerPapirEttersendelse}
              />
              <Route
                exact={true}
                path={`${path}/:ettersendelse(ettersendelse)?/dokumentinnsending`}
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
