import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";

export const InformasjonPapirsoknad = () => (
  <div className="papirsoknader" id="papirsoknader">
    <Undertittel>
      <FormattedMessage id={"vissoknadsobjekter.papirsoknader"} />
    </Undertittel>
    <div className="beskrivelse">
      <Normaltekst>
        <FormattedMessage id={"vissoknadsobjekter.papirsoknader.beskrivelse"} />
      </Normaltekst>
    </div>
  </div>
);

export default InformasjonPapirsoknad;
