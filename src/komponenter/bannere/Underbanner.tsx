import * as React from "react";
import Normaltekst from "nav-frontend-typografi/lib/normaltekst";
import Undertittel from "nav-frontend-typografi/lib/undertittel";

interface Props {
  tittel: string;
  skjemanummer?: string;
  undertittel?: string;
}

const Underbanner = (props: Props) => {
  return (
    <div className="underbanner">
      <Undertittel>{props.tittel}</Undertittel>
      {props.undertittel && <Normaltekst>{props.undertittel}</Normaltekst>}
      {props.skjemanummer && <Normaltekst>{props.skjemanummer}</Normaltekst>}
    </div>
  );
};

export default Underbanner;
