import React from "react";
import { Element, Normaltekst } from "nav-frontend-typografi";
import { FormattedMessage } from "react-intl";
import Veileder from "../Veileder";

const VeilederEttersendelse = () => (
  <Veileder>
    <Element>
      <FormattedMessage id="veileder.ettersendelse.tittel" />
    </Element>
    <Normaltekst>
      <FormattedMessage id="veileder.ettersendelse.steg1" />
    </Normaltekst>
    <Normaltekst>
      <FormattedMessage id="veileder.ettersendelse.steg2" />
    </Normaltekst>
  </Veileder>
);
export default VeilederEttersendelse;
