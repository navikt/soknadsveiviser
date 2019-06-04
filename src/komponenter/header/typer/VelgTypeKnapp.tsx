import React from "react";
import Undertittel from "nav-frontend-typografi/lib/undertittel";
import classNames from "classnames";
import { RouteComponentProps } from "react-router";
import { settValgtType } from "../../../states/reducers/kategorier";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { Store } from "../../../typer/store";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Dispatch } from "redux";

interface Routes {
  personEllerBedrift: string;
}

interface Props {
  type: string;
}

interface ReduxProps {
  valgtType: string;
  settValgtType: (type: string) => void;
}

type MergedProps = Props &
  InjectedIntlProps &
  RouteComponentProps<Routes> &
  ReduxProps;

const VelgTypeKnapp = (props: MergedProps) => {
  const { history, match, valgtType, settValgtType, type } = props;
  const { personEllerBedrift } = props.match.params;

  const settValgtTypeOgURL = () => {
    settValgtType(type);
    history.replace(match.url.replace(personEllerBedrift, type));
  };

  return (
    <button
      role="tab"
      onClick={settValgtTypeOgURL}
      className={classNames("typeElement", {
        valgt: valgtType === type
      })}
      aria-selected={valgtType === type}
    >
      <Undertittel>
        <FormattedMessage id={`kategorier.knapp.${props.type.toLowerCase()}`} />
      </Undertittel>
    </button>
  );
};

const mapStateToProps = (store: Store) => ({
  valgtType: store.kategorier.valgtType
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  settValgtType: (type: string) => dispatch(settValgtType(type))
});

export default injectIntl<Props & InjectedIntlProps>(
  withRouter<Props & RouteComponentProps<Routes> & InjectedIntlProps>(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(VelgTypeKnapp)
  )
);
