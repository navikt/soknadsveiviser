import React, { ChangeEvent } from "react";
import { settValgtVedleggSkalEttersendes } from "../../../../states/reducers/vedlegg";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Radio } from "nav-frontend-skjema";

interface Props {
  _key: string;
  skalEttersendes?: boolean;
}

interface ReduxProps {
  settValgtVedleggSkalEttersendes: (
    vedleggId: string,
    skalEttersendes: boolean
  ) => void;
}

type MergedProps = Props & ReduxProps;
const RadioButtons = (props: MergedProps) => {
  const onChange = (event: ChangeEvent<HTMLInputElement>) =>
    props.settValgtVedleggSkalEttersendes(
      event.target.name,
      event.target.value === "off"
    );
  return (
    <>
      <div className="dinevedlegg__checkbox">
        <Radio
          value="on"
          label={
            <span>
              &nbsp;
              <span className="mobile">
                <FormattedMessage id="dinevedlegg.sender.na" />
              </span>
            </span>
          }
          name={props._key}
          onChange={onChange}
          checked={!props.skalEttersendes}
        />
      </div>
      <div className="dinevedlegg__checkbox">
        <Radio
          value="off"
          label={
            <span>
              &nbsp;
              <span className="mobile">
                <FormattedMessage id="dinevedlegg.sender.senere" />
              </span>
            </span>
          }
          name={props._key}
          onChange={onChange}
          checked={props.skalEttersendes}
        />
      </div>
    </>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  settValgtVedleggSkalEttersendes: (
    vedleggId: string,
    skalEttersendes: boolean
  ) => dispatch(settValgtVedleggSkalEttersendes(vedleggId, skalEttersendes))
});

export default connect(
  undefined,
  mapDispatchToProps
)(RadioButtons);
