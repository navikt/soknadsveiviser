import * as React from "react";
import Element from "nav-frontend-typografi/lib/element";
import EtikettLiten from "nav-frontend-typografi/lib/etikett-liten";
import { FormattedMessage } from "react-intl";
import { SprakString } from "../../../typer/sprak";
import { localeTekst } from "../../../utils/sprak";
import { InjectedIntlProps, injectIntl } from "react-intl";
import LocaleTekst from "../../../komponenter/localetekst/LocaleTekst";
import { hentPDFurl, lastNedFil } from "./utils/pdf";
import { Hovedknapp } from "nav-frontend-knapper";

export interface Skjema {
  navn: SprakString;
  gyldigtil: SprakString;
  gyldigfra: SprakString;
  pdf: any;
  skjemanummer: string;
  emneord: { emneord: string }[];
  visEtikett?: boolean;
  valgtSprak: string;
}

interface Props {
  skjema: Skjema;
  visEtikett?: boolean;
  skjemaSprak: string;
}

type MergedProps = Props & InjectedIntlProps;
const Skjemavisning = (props: MergedProps) => {
  const { skjemaSprak, intl, visEtikett, skjema } = props;

  const lastNed = () => {
    const url = hentPDFurl(skjema.pdf, skjemaSprak, intl.locale);
    const tittel = localeTekst(skjema.navn, skjemaSprak);
    const filtype = url.split(".").pop() || "pdf";
    lastNedFil(url, tittel, filtype);
  };

  return (
    <div className="skjema__container">
      {visEtikett && (
        <div className="skjema__etikett">
          <Element>
            <LocaleTekst tekst={skjema.navn} />
          </Element>
          <EtikettLiten>{skjema.skjemanummer}</EtikettLiten>
        </div>
      )}
      <div className="skjema__knapp">
        <Hovedknapp onClick={lastNed}>
          <FormattedMessage id="avslutning.steg.lastned.knapp.ready" />
        </Hovedknapp>
      </div>
    </div>
  );
};

export default injectIntl(Skjemavisning);
