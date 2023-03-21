import * as React from "react";
import Element from "nav-frontend-typografi/lib/element";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { localeTekst } from "utils/sprak";
import LocaleTekst from "komponenter/localetekst/LocaleTekst";
import { hentPDFurl } from "./utils/pdf";
import { Skjema } from "typer/skjemaogvedlegg";
import { Undertekst } from "nav-frontend-typografi";

interface Props {
  skjema: Skjema;
  visEtikett?: boolean;
  skjemaSprak: string;
}

type MergedProps = Props & InjectedIntlProps;
const Skjemavisning = (props: MergedProps) => {
  const { skjemaSprak, intl, visEtikett, skjema } = props;

  // Definer url og filnavn
  const url = hentPDFurl(skjema.pdf, skjemaSprak, intl.locale);
  const tittel = `NAV - ${localeTekst(skjema.navn, skjemaSprak)}`;
  const filtype = url.split(".").pop() || "pdf";
  const filnavn = encodeURI(`${tittel}.${filtype}`);
  const filUrl = `${url}?dl=${filnavn}`;

  return (
    <div className="skjema__container">
      {visEtikett && (
        <div className="skjema__etikett">
          <Element>
            <LocaleTekst tekst={skjema.navn} />
          </Element>
          <Undertekst>{skjema.skjemanummer}</Undertekst>
        </div>
      )}
      <div className="skjema__knapp">
        <a href={filUrl} className={"knapp knapp--hoved"}>
          <FormattedMessage id="avslutning.steg.lastned.knapp.ready" />
        </a>
      </div>
    </div>
  );
};

export default injectIntl(Skjemavisning);
