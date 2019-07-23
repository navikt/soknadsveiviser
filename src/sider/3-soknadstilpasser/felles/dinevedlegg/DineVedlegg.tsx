import React, { useState } from "react";
import { Vedleggsobjekt } from "../../../../typer/skjemaogvedlegg";
import { Normaltekst, Undertittel } from "nav-frontend-typografi";
import { localeTekst } from "../../../../utils/sprak";
import AlertStripe from "nav-frontend-alertstriper";
import { LocaleBlockText } from "../../../../typer/sprak";
import TableHeader from "./TableHeader";
import VedleggModal from "./VedleggModal";
import VedleggRad from "./VedleggRad";
import {
  medValgtSoknadsobjekt,
  ValgtSoknad
} from "../../../../states/providers/ValgtSoknadsobjekt";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";

interface Props {
  visErVedleggPakrevd?: boolean;
  visRadioButtons?: boolean;
  vedleggTilInnsending: Vedleggsobjekt[];
}

interface ModalContent {
  display: boolean;
  content?: LocaleBlockText;
}

type MergedProps = Props & ValgtSoknad & InjectedIntlProps;
const DineVedlegg = (props: MergedProps) => {
  const { vedleggTilInnsending, intl } = props;
  const { visRadioButtons, visErVedleggPakrevd } = props;
  const { locale } = intl;
  const [showModal, setShowModal] = useState({
    display: false
  } as ModalContent);

  const vedleggTilEttersending = vedleggTilInnsending.filter(
    vedlegg => vedlegg.skalEttersendes === true
  );

  const vedleggTilInnsendingSortert = vedleggTilInnsending.sort((a, b) =>
    localeTekst(
      a.vedlegg.visningstittel ? a.vedlegg.visningstittel : a.vedlegg.navn,
      locale
    ).localeCompare(
      localeTekst(
        b.vedlegg.visningstittel ? b.vedlegg.visningstittel : b.vedlegg.navn,
        locale
      )
    )
  );

  let i = 0;
  return vedleggTilInnsending.length > 0 ? (
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
          {visRadioButtons && <TableHeader />}
          <VedleggModal
            display={showModal.display}
            content={showModal.content}
            onRequestClose={() => setShowModal({ display: false })}
          />
          {vedleggTilInnsendingSortert
            .filter(vedlegg => vedlegg.pakrevd)
            .map(vedleggsobjekt => (
              <VedleggRad
                i={++i}
                key={vedleggsobjekt._key}
                visErVedleggPakrevd={visErVedleggPakrevd}
                visRadioButtons={visRadioButtons}
                vedleggsobjekt={vedleggsobjekt}
                setShowModal={setShowModal}
              />
            ))}
          {vedleggTilInnsending
            .filter(vedlegg => !vedlegg.pakrevd)
            .map(vedleggsobjekt => (
              <VedleggRad
                i={++i}
                key={vedleggsobjekt._key}
                visRadioButtons={visRadioButtons}
                vedleggsobjekt={vedleggsobjekt}
                setShowModal={setShowModal}
              />
            ))}
        </div>
      </form>
      {vedleggTilEttersending.length > 0 && (
        <AlertStripe type="advarsel" className="dinevedlegg__alert">
          <FormattedMessage id="avslutning.advarsel" />
        </AlertStripe>
      )}
      <div className="dinevedlegg__footer">
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
