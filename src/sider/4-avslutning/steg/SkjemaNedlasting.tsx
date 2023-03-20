import * as React from "react";
import StegOverskrift from "./Overskrift";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import SkjemaVisning from "./SkjemaVisning";
import { Skjema } from "../../../typer/skjemaogvedlegg";
import AlertStripe from "nav-frontend-alertstriper";

interface Props {
  steg: number;
  skjemaSprak: string;
  hovedskjema: Skjema;
}

type MergedProps = Props & InjectedIntlProps;
const SkjemaNedlasting = (props: MergedProps) => {
  const { steg, skjemaSprak, hovedskjema, intl } = props;
  const { skjemanummer } = hovedskjema;

  return (
    <div className="steg__rad">
      <StegOverskrift
        steg={steg}
        tittel="avslutning.steg.nedlasting.skjema.tittel"
        tittelParams={{ skjemanummer }}
        beskrivelse="avslutning.steg.nedlasting.skjema.beskrivelse"
      />
      <div className="steg__overskrift-beskrivelse">
        <AlertStripe type="advarsel" form="inline">
          <b>
            <span dangerouslySetInnerHTML={{__html: intl.formatMessage(
              { id: 'avslutning.steg.nedlasting.skjema.obs' },
              )} }/>
          </b>
        </AlertStripe><br />
      </div>
      <SkjemaVisning skjemaSprak={skjemaSprak} skjema={hovedskjema} />
    </div>
  );
};

export default injectIntl<Props>(SkjemaNedlasting);
