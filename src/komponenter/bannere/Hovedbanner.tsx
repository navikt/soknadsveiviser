import * as React from "react";
import Systemtittel from "nav-frontend-typografi/lib/systemtittel";
import { Undertekst } from "nav-frontend-typografi";

interface Props {
  tittel: string;
  undertittel?: string;
  backgroundColor?: string;
  borderColor?: string;
}

const Banner = (props: Props) => {
  const { backgroundColor, borderColor } = props;

  const style = {
    backgroundColor: backgroundColor || "#e3b0a8",
    borderColor: borderColor || "#c86151"
  };

  return (
    <div className="hovedbanner" style={style}>
      {props.undertittel ? (
        <Undertekst className="litenEtikett">{props.undertittel}</Undertekst>
      ) : (
        <div style={{ padding: 12 }} />
      )}
      <Systemtittel>{props.tittel}</Systemtittel>
    </div>
  );
};

export default Banner;
