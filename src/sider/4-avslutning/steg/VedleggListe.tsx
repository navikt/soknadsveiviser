import * as React from "react";
import StegOverskrift from "./Overskrift";
import { Vedleggsobjekt } from "../../../typer/skjemaogvedlegg";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { Normaltekst } from "nav-frontend-typografi";
import { localeTekst } from "../../../utils/sprak";
import { localeVedleggstittel } from "../../../utils/soknadsobjekter";

interface Props {
  steg: number;
  tittel: string;
  beskrivelse?: string;
  vedlegg: Vedleggsobjekt[];
}

type MergedProps = Props & InjectedIntlProps;
const VedleggNedlasting = (props: MergedProps) => {
  const { steg, intl, vedlegg, tittel, beskrivelse } = props;

  return (
    <div className="steg__rad">
      <StegOverskrift steg={steg} tittel={tittel} beskrivelse={beskrivelse} />
      <div className="skjema">
        <ul>
          {vedlegg.map(vedleggsobjekt => {
            const { vedlegg, _key } = vedleggsobjekt;
            return (
              <li key={_key} className="steg__vedlegg-ettersendelse">
                <Normaltekst>
                  {vedlegg.skjematilvedlegg
                    ? localeTekst(vedlegg.skjematilvedlegg.navn, intl.locale)
                    : localeVedleggstittel(vedleggsobjekt, intl.locale)}
                </Normaltekst>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default injectIntl(VedleggNedlasting);
