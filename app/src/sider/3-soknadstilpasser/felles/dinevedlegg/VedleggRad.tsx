import React from "react";
import { Vedleggsobjekt } from "../../../../typer/skjemaogvedlegg";
import { Element } from "nav-frontend-typografi";
import LocaleTekst from "../../../../komponenter/localetekst/LocaleTekst";
import { LocaleBlockText } from "../../../../typer/sprak";
import RadioButtons from "./RadioButtons";
import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl,
  InjectedIntlProps
} from "react-intl";
import { blockToPlainText } from "../../../../utils/sprak";

interface Props {
  i: number;
  visErVedleggPakrevd?: boolean;
  visRadioButtons?: boolean;
  vedleggsobjekt: Vedleggsobjekt;
  setShowModal: (data: { display: boolean; content: LocaleBlockText }) => void;
}

const VedleggRad = (props: Props & InjectedIntlProps) => {
  const { vedleggsobjekt, setShowModal, i, intl } = props;
  const { visRadioButtons, visErVedleggPakrevd } = props;
  const { _key, pakrevd, vedlegg, skalEttersendes } = vedleggsobjekt;
  const { beskrivelse } = vedleggsobjekt;
  return (
    <div key={_key} className="dinevedlegg__vedlegg">
      <div className="dinevedlegg__id">{i}.</div>
      <div className="dinevedlegg__test">
        <div className="dinevedlegg__tittel">
          {pakrevd && visErVedleggPakrevd && (
            <Element>
              <FormattedHTMLMessage id="dinevedlegg.pakrevd" />{" "}
            </Element>
          )}
          <div className="dinevedlegg__beskrivelse-container">
            <div className="dinevedlegg__beskrivelse">
              <Element>
                <LocaleTekst tekst={vedlegg.navn} />
              </Element>
            </div>
            <div className="dinevedlegg__hvaerdette">
              {pakrevd &&
                beskrivelse &&
                blockToPlainText(beskrivelse, intl.locale) && (
                  <div
                    className="lenke dinevedlegg__lenke"
                    onClick={() =>
                      setShowModal({
                        display: true,
                        content: beskrivelse
                      })
                    }
                  >
                    <FormattedMessage id="velgvedlegg.lesmer.hvaerdette" />
                  </div>
                )}
            </div>
          </div>
        </div>
        {visRadioButtons && (
          <RadioButtons _key={_key} skalEttersendes={skalEttersendes} />
        )}
      </div>
    </div>
  );
};

export default injectIntl(VedleggRad);
