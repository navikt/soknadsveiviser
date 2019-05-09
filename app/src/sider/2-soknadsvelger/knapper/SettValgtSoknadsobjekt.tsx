import * as React from "react";
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { settVedlegg } from "../../../states/reducers/vedlegg";
import { settValgtSoknadsobjekt } from "../../../states/reducers/valgtSoknad";
import { Soknadsobjekt } from "../../../typer/soknad";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";

interface Props {
  to: string;
  title: string;
  soknadsobjekt: Soknadsobjekt;
  styling?: string;
}

interface ReduxProps {
  settValgtSoknadsobjekt: (soknadsobjekt: Soknadsobjekt) => void;
}

type MergedProps = Props & InjectedIntlProps & RouteComponentProps & ReduxProps;
const SettValgtSoknadsobjekt = (props: MergedProps) => {
  const { soknadsobjekt, intl, to, title, styling } = props;

  return (
    <Link
      id={soknadsobjekt.navn[intl.locale]}
      to={to}
      className={styling ? styling : "knapp knapp--standard soknadsobjekt__knapp"}
      onClick={() => props.settValgtSoknadsobjekt(soknadsobjekt)}
    >
      <FormattedMessage id={title} />
    </Link>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  settValgtSoknadsobjekt: async (soknadsobjekt: Soknadsobjekt) => {
    dispatch(settValgtSoknadsobjekt(soknadsobjekt));
    dispatch(settVedlegg(soknadsobjekt));
  }
});

export default withRouter<Props & RouteComponentProps>(
  injectIntl<Props & RouteComponentProps & InjectedIntlProps>(
    connect(
      undefined,
      mapDispatchToProps
    )(SettValgtSoknadsobjekt)
  )
);
