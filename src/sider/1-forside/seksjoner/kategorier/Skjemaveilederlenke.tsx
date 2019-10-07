import { getSkjemaveilederUrlBedrift, getSkjemaveilederUrlPerson } from "../../../../config";
import React from "react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";

interface Props {
    type: string;
}

const Skjemaveilederlenke = (props: Props & InjectedIntlProps) => (
    <div className="skjemaveilederlenke">
        {props.type === "bedrift" ?
            <a className="lenke" href={getSkjemaveilederUrlBedrift()}>
                <FormattedMessage id="skjemaveilederlenke.bedrift" />
            </a> :
            <a className="lenke" href={getSkjemaveilederUrlPerson(props.intl.locale)}>
                <FormattedMessage id="skjemaveilederlenke.person" />
            </a>
        }
    </div>
);

export default injectIntl<Props & InjectedIntlProps>(Skjemaveilederlenke);
