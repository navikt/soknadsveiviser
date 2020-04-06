import * as React from "react";
import StegOverskrift from "./Overskrift";
import { injectIntl, InjectedIntlProps } from "react-intl";
import SkjemaVisning from "./SkjemaVisning";
import { Skjema } from "../../../typer/skjemaogvedlegg";

interface Props {
  steg: number;
  skjemaSprak: string;
  hovedskjema: Skjema;
}

type MergedProps = Props & InjectedIntlProps;
const SkjemaNedlasting = (props: MergedProps) => {
  const { steg, skjemaSprak, hovedskjema } = props;
  const { skjemanummer } = hovedskjema;

  return (
    <div className="steg__rad">
      <StegOverskrift
        steg={steg}
        tittel="avslutning.steg.nedlasting.skjema.tittel"
        tittelParams={{ skjemanummer }}
        beskrivelse="avslutning.steg.nedlasting.skjema.beskrivelse"
        obs="avslutning.steg.nedlasting.skjema.obs"
      />
      <SkjemaVisning skjemaSprak={skjemaSprak} skjema={hovedskjema} />
    </div>
  );
};

export default injectIntl<Props>(SkjemaNedlasting);
