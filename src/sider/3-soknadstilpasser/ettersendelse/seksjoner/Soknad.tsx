import * as React from "react";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { withRouter, RouteComponentProps } from "react-router";

interface Props {
  digitalEttersendelse?: boolean;
  url: string;
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
const Ettersendelse = (props: MergedProps) => {
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
          <FormattedMessage id="ettersendelser.mellomledd.soknad.tittel" />
        </Undertittel>
        <div className="ettersendelse__beskrivelse">
          <Normaltekst>
            <FormattedMessage id="ettersendelser.mellomledd.soknad.beskrivelse" />
          </Normaltekst>
        </div>
      </div>
      <div className="ettersendelse__knapper">
        {digitalEttersendelse && (
          <a
            href={props.url}
            className="ettersendelse__knapp knapp knapp-hoved"
          >
            <FormattedMessage id="ettersendelser.mellomledd.digital.knapp" />
          </a>
        )}
        <Link
          to={
            `/soknader` +
            `/${sprak}` +
            `/${personEllerBedrift}` +
            `/${kategori}` +
            `/${underkategori}` +
            `/${skjemanummer}/ettersendelse` +
            `/brev`
          }
          className="ettersendelse__knapp knapp knapp-hoved"
        >
          <FormattedMessage id="ettersendelser.mellomledd.soknad.knapp" />
        </Link>
      </div>
    </div>
  );
};
export default withRouter(Ettersendelse);
