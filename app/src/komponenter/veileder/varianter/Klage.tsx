import React from "react";
import { Element, Normaltekst } from "nav-frontend-typografi";
import { FormattedMessage } from "react-intl";
import Veileder from "../Veileder";

const VeilederKlage = () => (
  <Veileder>
    <Element>
      <FormattedMessage id="veileder.klage.tittel" />
    </Element>
    <Normaltekst>
      <FormattedMessage id="veileder.klage.steg1" />
    </Normaltekst>
    <Normaltekst>
      <FormattedMessage id="veileder.klage.steg2" />
    </Normaltekst>
  </Veileder>
);
export default VeilederKlage;
