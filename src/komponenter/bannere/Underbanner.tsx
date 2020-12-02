import * as React from "react";
import Normaltekst from "nav-frontend-typografi/lib/normaltekst";
import Undertittel from "nav-frontend-typografi/lib/undertittel";

interface Props {
  tittel: string;
  skjemanummer?: string;
}

const Underbanner = (props: Props) => {
  return (
    <div className="underbanner">
      <Undertittel>{props.tittel}</Undertittel>
      {props.skjemanummer && <Normaltekst>{props.skjemanummer}</Normaltekst>}
    </div>
  );
};

export default Underbanner;
