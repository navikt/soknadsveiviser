import * as React from "react";
import Systemtittel from "nav-frontend-typografi/lib/systemtittel";
import EtikettLiten from "nav-frontend-typografi/lib/etikett-liten";

interface Props {
  tittel: string;
  undertittel: string;
  backgroundColor?: string;
  borderColor?: string;
}

const Banner = (props: Props) => {
  const { backgroundColor, borderColor } = props;

  const style = {
    backgroundColor: backgroundColor || "#CCC9C5",
    borderColor: borderColor || "#9F9C99"
  };

  return (
    <div className="hovedbanner" style={style}>
      <EtikettLiten className="litenEtikett">{props.undertittel}</EtikettLiten>
      <Systemtittel>{props.tittel}</Systemtittel>
    </div>
  );
};

export default Banner;
