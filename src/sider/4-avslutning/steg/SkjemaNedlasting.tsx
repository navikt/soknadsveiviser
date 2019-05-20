import * as React from "react";
import StegOverskrift from "./Overskrift";
import { Soknadsobjekt } from "../../../typer/soknad";
import { injectIntl, InjectedIntlProps } from "react-intl";
import SkjemaVisning from "./SkjemaVisning";

interface Props {
  steg: number;
  skjemaSprak: string;
  soknadsobjekt: Soknadsobjekt;
}

type MergedProps = Props & InjectedIntlProps;
const SkjemaNedlasting = (props: MergedProps) => {
  const { steg, skjemaSprak, soknadsobjekt } = props;
  const { hovedskjema } = soknadsobjekt;
  const { skjemanummer } = hovedskjema;

  return (
    <div className="steg__rad">
      <StegOverskrift
        steg={steg}
        tittel="avslutning.steg.nedlasting.skjema.tittel"
        tittelParams={{ skjemanummer }}
        beskrivelse="avslutning.steg.nedlasting.skjema.beskrivelse"
      />
      <SkjemaVisning skjemaSprak={skjemaSprak} skjema={hovedskjema} />
    </div>
  );
};

export default injectIntl<Props>(SkjemaNedlasting);
