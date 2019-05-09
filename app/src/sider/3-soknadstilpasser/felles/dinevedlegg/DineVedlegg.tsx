import React, { useState } from "react";
import { Vedleggsobjekt } from "../../../../typer/vedlegg";
import { Normaltekst, Undertittel, Element } from "nav-frontend-typografi";
import LocaleTekst from "../../../../komponenter/localetekst/LocaleTekst";
import AlertStripe from "nav-frontend-alertstriper";
import { SprakBlockText } from "../../../../typer/sprak";
import RadioButtons from "./RadioButtons";
import TableHeader from "./TableHeader";
import VedleggModal from "./VedleggModal";
import {
  medValgtSoknadsobjekt,
  ValgtSoknad
} from "../../../../states/providers/ValgtSoknadsobjekt";
import {
  InjectedIntlProps,
  injectIntl,
  FormattedMessage,
  FormattedHTMLMessage
} from "react-intl";

interface Props {
  ettersendelse?: boolean;
  relevanteVedlegg: Vedleggsobjekt[];
}

interface ModalContent {
  display: boolean;
  content?: SprakBlockText;
}

type MergedProps = Props & ValgtSoknad & InjectedIntlProps;
const DineVedlegg = (props: MergedProps) => {
  const { relevanteVedlegg, ettersendelse } = props;
  const [showModal, setShowModal] = useState({
    display: false
  } as ModalContent);

  const vedleggTilEttersending = relevanteVedlegg.filter(
    vedlegg => vedlegg.skalEttersendes === true
  );

  let i = 0;
  return relevanteVedlegg.length > 0 ? (
    <div className="panel seksjon seksjon__avstand">
      <Undertittel>
        <FormattedMessage id="dinevedlegg.tittel" />
      </Undertittel>
      <div className="dinevedlegg__ingress">
        <Normaltekst>
          <FormattedMessage id="dinevedlegg.ingress" />
        </Normaltekst>
      </div>
      <form>
        <div className="dinevedlegg__wrapper">
          {!ettersendelse && <TableHeader />}
          <VedleggModal
            display={showModal.display}
            content={showModal.content}
            onRequestClose={() => setShowModal({ display: false })}
          />
          {relevanteVedlegg
            .sort(a => (a.pakrevd ? -1 : 1))
            .map(({ vedlegg, pakrevd, _key, skalEttersendes, beskrivelse }) => (
              <div key={_key} className="dinevedlegg__vedlegg">
                <div className="dinevedlegg__id">{++i}.</div>
                <div className="dinevedlegg__tittel">
                  <Element>
                    {pakrevd && (
                      <FormattedHTMLMessage id="dinevedlegg.pakrevd" />
                    )}
                    <LocaleTekst tekst={vedlegg.navn} />
                    {beskrivelse && (
                      <span
                        className="lenke dinevedlegg__lenke"
                        onClick={() =>
                          setShowModal({
                            display: true,
                            content: beskrivelse
                          })
                        }
                      >
                        <FormattedMessage id="velgvedlegg.lesmer.hvaerdette" />
                      </span>
                    )}
                  </Element>
                </div>
                {!ettersendelse && (
                  <RadioButtons _key={_key} skalEttersendes={skalEttersendes} />
                )}
              </div>
            ))}
        </div>
      </form>
      {vedleggTilEttersending.length > 0 && (
        <AlertStripe type="advarsel">
          <FormattedMessage id="avslutning.advarsel" />
        </AlertStripe>
      )}
      <div className="dinevedlegg__beskrivelse">
        <Normaltekst>
          <FormattedMessage id="dinevedlegg.beskrivelse" />
        </Normaltekst>
      </div>
    </div>
  ) : null;
};
export default medValgtSoknadsobjekt<Props & ValgtSoknad>(
  injectIntl<Props & ValgtSoknad & InjectedIntlProps>(DineVedlegg)
);
