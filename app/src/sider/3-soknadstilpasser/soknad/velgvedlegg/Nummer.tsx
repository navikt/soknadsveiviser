import { Systemtittel } from "nav-frontend-typografi";
import * as React from "react";

const Nummer = (props: {
  spmNummer: number;
  antallSpm: number;
  kategoriFarge: string;
}) => {
  const { spmNummer, antallSpm, kategoriFarge } = props;
  return (
    <div className="vedlegg__nummerering">
      <hr
        className="vedlegg__vertikal-linje"
        style={spmNummer > 1 ? undefined : { visibility: "hidden" }}
      />
      <div>
        <div className="circle circle__nummer" style={{ background: kategoriFarge }}>
          <Systemtittel className="vedlegg__tall">
            {spmNummer}/{antallSpm}
          </Systemtittel>
        </div>
      </div>
      <hr
        className="vedlegg__vertikal-linje"
        style={spmNummer < antallSpm ? undefined : { visibility: "hidden" }}
      />
    </div>
  );
};

export default Nummer;
