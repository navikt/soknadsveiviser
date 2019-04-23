import * as React from "react";
import Element from "nav-frontend-typografi/lib/element";
import EtikettLiten from "nav-frontend-typografi/lib/etikett-liten";
import { FormattedMessage } from "react-intl";
import { SprakString } from "../../../typer/sprak";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { getSanityDataset } from "../../../config";
import LocaleTekst from "../../../komponenter/localetekst/LocaleTekst";

export interface Skjema {
  navn: SprakString;
  gyldigtil: SprakString;
  gyldigfra: SprakString;
  pdf: any;
  skjemanummer: string;
  emneord: { emneord: string }[];
  visEtikett?: boolean;
  valgtSprak: string;
}

type MergedProps = Skjema & InjectedIntlProps;
const Skjemavisning = (props: MergedProps) => {
  const { pdf, valgtSprak, intl, skjemanummer, navn, visEtikett } = props;

  let PDFsprak = pdf[valgtSprak] ? valgtSprak : intl.locale;
  PDFsprak = pdf[`${PDFsprak}`] ? PDFsprak : `nb`;

  const reg = new RegExp("file-(.*)-pdf");
  const regResultat = reg.exec(pdf[`${PDFsprak}`].asset._ref);
  const sanityUrl = `http://cdn.sanity.io/files/gx9wf39f/${getSanityDataset()}/`;
  const fil = regResultat ? regResultat[1] : "";
  const pdfUrl = sanityUrl + fil + ".pdf?dl";

  return (
    <div className="skjema__container">
      {visEtikett && (
        <div className="skjema__etikett">
          <Element>
            <LocaleTekst tekst={navn} />
          </Element>
          <EtikettLiten>{skjemanummer}</EtikettLiten>
        </div>
      )}
      <div className="skjema__knapp">
        <a
          href={pdfUrl}
          download={true}
          className="nedlastningsknapp knapp knapp--hoved innsendingsvalg__knapp"
        >
          <FormattedMessage id="avslutning.knapp.lastned" />
        </a>
      </div>
    </div>
  );
};

export default injectIntl(Skjemavisning);
