import * as React from "react";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { withRouter, RouteComponentProps } from "react-router";

interface Props {}

interface Routes {
  sprak: string;
  personEllerBedrift: string;
  ettersendelse: string;
  skjemanummer: string;
  kategori: string;
  underkategori: string;
}

type MergedProps = Props & RouteComponentProps<Routes>;
const PapirEttersendelse = (props: MergedProps) => {
  const { match } = props;
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
          <FormattedMessage id="ettersendelser.mellomledd.papir.tittel" />
        </Undertittel>
        <div className="ettersendelse__beskrivelse">
          <Normaltekst>
            <FormattedMessage id="ettersendelser.mellomledd.papir.beskrivelse" />
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
