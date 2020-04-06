import * as React from "react";
import Normaltekst from "nav-frontend-typografi/lib/normaltekst";
import Undertittel from "nav-frontend-typografi/lib/undertittel";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl";

export interface Props {
  steg: number;
  tittel: string;
  tittelParams?: {
    [key: string]: string;
  };
  beskrivelse?: string;
}

const Steg = (props: Props) => (
  <div className="steg__overskrift-container">
    <Undertittel>
      {props.steg}:{" "}
      <FormattedMessage id={props.tittel} values={props.tittelParams} />
    </Undertittel>
    {props.beskrivelse && (
      <div className="steg__overskrift-beskrivelse">
        <Normaltekst>
          <FormattedHTMLMessage id={props.beskrivelse} />
        </Normaltekst>
      </div>
    )}
  </div>
);

export default Steg;
