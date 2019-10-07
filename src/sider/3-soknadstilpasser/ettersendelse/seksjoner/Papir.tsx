import * as React from "react";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { withRouter, RouteComponentProps } from "react-router";

interface Props {
    digitalEttersendelse?: boolean;
}

interface Routes {
  sprak: string;
  personEllerBedrift: string;
  ettersendelse: string;
  skjemanummer: string;
  kategori: string;
  underkategori: string;
}

type MergedProps = Props & RouteComponentProps<Routes>;
const PapirEttersendelse = (props: MergedProps ) => {
  const { match, digitalEttersendelse } = props;
  const {
    sprak,
    skjemanummer,
    kategori,
    underkategori,
    personEllerBedrift
  } = match.params;

  return (
    <div className="ettersendelse__container">
      <div className="ettersendelse__innhold">
        <Undertittel>
            {digitalEttersendelse ?
                <FormattedMessage id="ettersendelser.mellomledd.papir.finnesdigital.tittel" />
                : <FormattedMessage id="ettersendelser.mellomledd.papir.ikkedigital.tittel" />}
        </Undertittel>
        <div className="ettersendelse__beskrivelse">
          <Normaltekst>
              {digitalEttersendelse ?
                  <FormattedMessage id="ettersendelser.mellomledd.papir.finnesdigital.beskrivelse" />
                  : <FormattedMessage id="ettersendelser.mellomledd.papir.ikkedigital.beskrivelse" />}
          </Normaltekst>
        </div>
      </div>
      <div className="ettersendelse__knapper">
        <Link
          to={
            `/soknader` +
            `/${sprak}` +
            `/${personEllerBedrift}` +
            `/${kategori}` +
            `/${underkategori}` +
            `/${skjemanummer}/brev` +
            `/ettersendelse`
          }
          className="knapp knapp-hoved"
        >
          <FormattedMessage id="ettersendelser.mellomledd.papir.knapp" />
        </Link>
      </div>
    </div>
  );
};
export default withRouter(PapirEttersendelse);
