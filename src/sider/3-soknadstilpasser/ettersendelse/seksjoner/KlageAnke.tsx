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
const KlageEttersendelse = (props: MergedProps) => {
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
          <FormattedMessage id="ettersendelser.mellomledd.klageanke.tittel" />
        </Undertittel>
        <div className="ettersendelse__beskrivelse">
          <Normaltekst>
            <FormattedMessage id="ettersendelser.mellomledd.klage.beskrivelse" />
          </Normaltekst>
        </div>
        <div className="ettersendelse__beskrivelse">
          <Normaltekst>
            <FormattedMessage id="ettersendelser.mellomledd.anke.beskrivelse" />
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
            `/${skjemanummer}` +
            `/klage/ettersendelse/brev`
          }
          className="ettersendelse__knapp knapp knapp-hoved"
        >
          <FormattedMessage id="ettersendelser.mellomledd.klage.knapp" />
        </Link>
        <Link
          to={
            `/soknader` +
            `/${sprak}` +
            `/${personEllerBedrift}` +
            `/${kategori}` +
            `/${underkategori}` +
            `/${skjemanummer}` +
            `/anke/ettersendelse/brev`
          }
          className="ettersendelse__knapp knapp knapp-hoved"
        >
          <FormattedMessage id="ettersendelser.mellomledd.anke.knapp" />
        </Link>
      </div>
    </div>
  );
};
export default withRouter(KlageEttersendelse);
