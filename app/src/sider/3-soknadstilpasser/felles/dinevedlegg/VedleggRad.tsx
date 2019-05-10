import React from "react";
import { Vedleggsobjekt } from "../../../../typer/vedlegg";
import { Element } from "nav-frontend-typografi";
import LocaleTekst from "../../../../komponenter/localetekst/LocaleTekst";
import { SprakBlockText } from "../../../../typer/sprak";
import RadioButtons from "./RadioButtons";
import { FormattedMessage, FormattedHTMLMessage } from "react-intl";

interface Props {
  i: number;
  visRadioButtons?: boolean;
  vedleggsobjekt: Vedleggsobjekt;
  setShowModal: (data: { display: boolean; content: SprakBlockText }) => void;
}

const VedleggRad = (props: Props) => {
  const { vedleggsobjekt, visRadioButtons, setShowModal, i } = props;
  const { _key, pakrevd, vedlegg, skalEttersendes } = vedleggsobjekt;
  const { beskrivelse } = vedlegg;
  return (
    <div key={_key} className="dinevedlegg__vedlegg">
      <div className="dinevedlegg__id">{i}.</div>
      <div className="dinevedlegg__tittel">
        <Element>
          {pakrevd && visRadioButtons && (
            <FormattedHTMLMessage id="dinevedlegg.pakrevd" />
          )}
          <LocaleTekst tekst={vedlegg.navn} />
          {pakrevd && beskrivelse && (
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
      {visRadioButtons && (
        <RadioButtons _key={_key} skalEttersendes={skalEttersendes} />
      )}
    </div>
  );
};

export default VedleggRad;
