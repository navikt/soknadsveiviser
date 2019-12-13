import * as React from "react";
import StegOverskrift from "./Overskrift";
import { Vedleggsobjekt } from "../../../typer/skjemaogvedlegg";
import SkjemaVisning from "./SkjemaVisning";

interface Props {
  steg: number;
  skjemaSprak: string;
  vedlegg: Vedleggsobjekt[];
}

type MergedProps = Props;
const VedleggNedlasting = (props: MergedProps) => {
  const { steg, vedlegg, skjemaSprak } = props;

  return (
    <div className="steg__rad">
      <StegOverskrift
        steg={steg}
        tittel="avslutning.steg.nedlasting.vedlegg.tittel"
        beskrivelse="avslutning.steg.nedlasting.vedlegg.beskrivelse"
      />
      {vedlegg.map(
        vedleggsobjekt =>
          vedleggsobjekt.vedlegg.skjematilvedlegg && (
            <SkjemaVisning
              visEtikett={true}
              key={vedleggsobjekt._key}
              skjemaSprak={skjemaSprak}
              skjema={vedleggsobjekt.vedlegg.skjematilvedlegg}
            />
          )
      )}
    </div>
  );
};

export default VedleggNedlasting;
