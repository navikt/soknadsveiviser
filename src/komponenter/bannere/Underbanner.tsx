import * as React from "react";
import Element from "nav-frontend-typografi/lib/element";
import Undertittel from "nav-frontend-typografi/lib/undertittel";

interface Props {
  tittel: string;
  skjemanummer: string;
}

const Underbanner = (props: Props) => {
  return (
    <div className="underbanner">
      <Undertittel>{props.tittel}</Undertittel>
      <Element>{props.skjemanummer}</Element>
    </div>
  );
};

export default Underbanner;
