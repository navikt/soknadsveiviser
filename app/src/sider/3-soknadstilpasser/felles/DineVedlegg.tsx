import * as React from "react";
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl";
import { Vedleggsobjekt } from "../../../typer/skjemaogvedlegg";
import { Normaltekst, Undertittel, Element } from "nav-frontend-typografi";
import LocaleTekst from "../../../komponenter/localetekst/LocaleTekst";

interface Props {
  vedleggTilInnsending: Vedleggsobjekt[];
}

const DineVedlegg = (props: Props & InjectedIntlProps) => {
  const { vedleggTilInnsending, intl } = props;

  return vedleggTilInnsending.length > 0 ? (
    <div className="steg__rad">
      <Undertittel>
        <FormattedMessage id="dinevedlegg.tittel" />
      </Undertittel>
      <div className="dinevedlegg__ingress">
        <Normaltekst>
          <FormattedMessage id="dinevedlegg.ingress" />
        </Normaltekst>
      </div>
      <div className="dinevedlegg__vedlegg">
        <ol>
          {vedleggTilInnsending.map(({ vedlegg, pakrevd, _key }) => (
            <li key={_key}>
              <Element>
                {pakrevd && intl.formatMessage({ id: "dinevedlegg.pakrevd" })}
                <LocaleTekst tekst={vedlegg.navn} />
              </Element>
            </li>
          ))}
        </ol>
      </div>
      <div className="dinevedlegg__beskrivelse">
        <Normaltekst>
          <FormattedMessage id="dinevedlegg.beskrivelse" />
        </Normaltekst>
      </div>
    </div>
  ) : null;
};

export default injectIntl(DineVedlegg);
