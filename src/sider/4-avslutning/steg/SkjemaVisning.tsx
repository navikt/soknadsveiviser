import * as React from "react";
import Element from "nav-frontend-typografi/lib/element";
import EtikettLiten from "nav-frontend-typografi/lib/etikett-liten";
import { FormattedMessage } from "react-intl";
import { localeTekst } from "../../../utils/sprak";
import { InjectedIntlProps, injectIntl } from "react-intl";
import LocaleTekst from "../../../komponenter/localetekst/LocaleTekst";
import { hentPDFurl, lastNedFilBlob } from "./utils/pdf";
import { Hovedknapp } from "nav-frontend-knapper";
import { Skjema } from "../../../typer/skjemaogvedlegg";
import { loggApiError } from "../../../utils/logger";
import { useState } from "react";
import AlertStripe from "nav-frontend-alertstriper";
import { useParams } from "react-router";
import ReactGA from "react-ga";

ReactGA.initialize("UA-9127381-16");
ReactGA.set({ anonymizeIp: true });

interface Props {
  skjema: Skjema;
  visEtikett?: boolean;
  skjemaSprak: string;
}

type MergedProps = Props & InjectedIntlProps;
const Skjemavisning = (props: MergedProps) => {
  const { skjemaSprak, intl, visEtikett, skjema } = props;
  const [loading, settLoading] = useState(false);
  const [error, settError] = useState();
  const { personEllerBedrift, kategori, underkategori } = useParams();

  const lastNed = () => {
    const url = hentPDFurl(skjema.pdf, skjemaSprak, intl.locale);
    const tittel = localeTekst(skjema.navn, skjemaSprak);
    const filtype = url.split(".").pop() || "pdf";

    settLoading(true);
    ReactGA.event({
      category: "Søknadsveiviser",
      action: "Last ned skjema",
      label: `/${personEllerBedrift}/${kategori}/${underkategori}/${skjema.skjemanummer}/nedlasting/skjema`
    });

    fetch(url)
      .then(response => response.blob())
      .then(blob => lastNedFilBlob(blob, `NAV - ${tittel}`, filtype))
      .catch(e => {
        const error = `Klarte ikke å laste ned ${tittel}: ${e}`;
        settError(error);
        loggApiError(url, error);
        console.error(error);
      })
      .then(() => settLoading(false));
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
        <Hovedknapp onClick={lastNed} disabled={loading} spinner={loading}>
          <FormattedMessage id="avslutning.steg.lastned.knapp.ready" />
        </Hovedknapp>
      </div>
      {error && (
        <div className="error__container">
          <AlertStripe type="advarsel">{error}</AlertStripe>
        </div>
      )}
    </div>
  );
};

export default injectIntl(Skjemavisning);
