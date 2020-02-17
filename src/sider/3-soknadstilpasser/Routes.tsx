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
import MedValgtSoknadsobjekt from "../../states/providers/ValgtSoknadsobjekt";
import DigitalEllerPapirEttersendelse from "./ettersendelse/DigitalEllerPapirEttersendelse";
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter
} from "react-router-dom";
import Soknad from "./soknad/Soknad";

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
    // @ts-ignore
    // @ts-ignore
    return (
      <Switch>
        <Wrapper>
          <MedValgtSoknadsobjekt>
            <MedPersonalia>
              <Route
                exact={true}
                path={`${path}/klage-eller-anke/brev`}
                component={VelgKlageEllerAnke}
              />
              <Route
                exact={true}
                path={`${path}/klage/:ettersendelse(ettersendelse)?/brev`}
                component={Klage}
              />
              <Route
                exact={true}
                path={`${path}/anke/:ettersendelse(ettersendelse)?/brev`}
                component={Anke}
              />
              <Route
                exact={true}
                path={`${path}/klage/:ettersendelse(ettersendelse)?/brev/avslutning`}
                /* tslint:disable-next-line:jsx-no-lambda */
                render={props => <AvslutningKlage {...props} />}
              />
              <Route
                exact={true}
                path={`${path}/anke/:ettersendelse(ettersendelse)?/brev/avslutning`}
                /* tslint:disable-next-line:jsx-no-lambda */
                render={props => <AvslutningAnke {...props} />}
              />
              <Route
                exact={true}
                path={`${path}/:ettersendelse(ettersendelse)?/brev/avslutning`}
                /* tslint:disable-next-line:jsx-no-lambda */
                render={props => <AvslutningSoknad {...props} />}
              />
              <Route
                exact={true}
                path={`${path}/ettersendelse/:innsendingsmate(brev|dokumentinnsending)`}
                component={Ettersendelse}
              />
              <Route
                exact={true}
                path={`${path}/ettersendelse`}
                component={DigitalEllerPapirEttersendelse}
              />
              <Route exact={true} path={`${path}/:innsendingsmate(brev|dokumentinnsending)`} component={Soknad} />
            </MedPersonalia>
          </MedValgtSoknadsobjekt>
        </Wrapper>
      </Switch>
    );
  };
}

export default withRouter(injectIntl(SkjemaVelgerRoutes));
