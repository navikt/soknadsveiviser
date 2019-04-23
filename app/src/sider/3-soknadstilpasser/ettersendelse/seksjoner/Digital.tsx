import * as React from "react";
import { getTjenesteUrl } from "../../../../config";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import { FormattedMessage } from "react-intl";

const DigitalEttersendelse = () => (
  <div className="ettersendelse__container">
    <div className="ettersendelse__innhold">
      <Undertittel>
        <FormattedMessage id="ettersendelser.mellomledd.digital.tittel" />
      </Undertittel>
      <div className="ettersendelse__beskrivelse">
        <Normaltekst>
          <FormattedMessage id="ettersendelser.mellomledd.digital.beskrivelse" />
        </Normaltekst>
        <div className="ettersendelse__note">
          <Normaltekst>
            <b>
              <FormattedMessage id="ettersendelser.mellomledd.digital.advarsel" />
            </b>
          </Normaltekst>
        </div>
      </div>
    </div>
    <div className="ettersendelse__knapper">
      <a
        href={`${getTjenesteUrl()}/saksoversikt`}
        className="knapp knapp-hoved"
      >
        <FormattedMessage id="ettersendelser.mellomledd.digital.knapp" />
      </a>
    </div>
  </div>
);

export default DigitalEttersendelse;
