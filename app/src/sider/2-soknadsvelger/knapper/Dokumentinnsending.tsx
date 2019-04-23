import * as React from "react";
import { Soknadsobjekt } from "../../../typer/soknad";
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { settValgtSoknadsobjekt } from "../../../states/reducers/valgtSoknad";
import { connect } from "react-redux";

interface Props {
  soknadsobjekt: Soknadsobjekt;
  settValgtSoknadsobjekt: (soknadsobjekt: Soknadsobjekt) => void;
}

type MergedProps = Props & InjectedIntlProps & RouteComponentProps;
const Dokumentinnsending = (props: MergedProps) => {
  const { soknadsobjekt, match } = props;
  const { hovedskjema } = soknadsobjekt;

  return (
    <>
      <Link
        id={hovedskjema.skjemanummer}
        to={`${match.url}/${hovedskjema.skjemanummer}/dokumentinnsending`}
        className="knapp knapp--hoved"
        onClick={() => props.settValgtSoknadsobjekt(soknadsobjekt)}
      >
        <FormattedMessage id="vissoknadsobjekter.knapp.dokumentinnsending" />
      </Link>
    </>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  settValgtSoknadsobjekt: async (soknadsobjekt: Soknadsobjekt) =>
    dispatch(settValgtSoknadsobjekt(soknadsobjekt))
});

export default connect(
  undefined,
  mapDispatchToProps
)(withRouter(injectIntl(Dokumentinnsending)));
