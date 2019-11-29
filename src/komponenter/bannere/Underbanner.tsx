import * as React from "react";
import Normaltekst from "nav-frontend-typografi/lib/normaltekst";
import Element from "nav-frontend-typografi/lib/element";
import Undertittel from "nav-frontend-typografi/lib/undertittel";

interface Props {
  tittel: string;
  undertittel?: string;
  skjemanummer: string;
}

const Underbanner = (props: Props) => {
  return (
    <div className="underbanner">
      <Undertittel>{props.tittel}</Undertittel>
      {props.undertittel && <Normaltekst>{props.undertittel}</Normaltekst>}
      <Element>{props.skjemanummer}</Element>
    </div>
  );
};

export default Underbanner;
