import * as React from "react";
import ReactTable, { Column } from "react-table";
import { HashLink } from "react-router-hash-link";
import HoverImg from "../../../utils/hoverImg";
import { Skjema } from "../../4-avslutning/steg/SkjemaVisning";

const linjeDownloadIkon = require("../../../img/line-version-download-1.svg");
const fyltDownloadIkon = require("../../../img/filled-version-download-1.svg");

const innerColumns = [
  { Header: "ID", accessor: "skjemanummer", maxWidth: 150 },
  { Header: "Navn på skjema", accessor: "skjemanavn" },
  { Header: "Målgruppe", accessor: "malgruppe", maxWidth: 150 },
  { Header: "Språk/målform", accessor: "sprak", maxWidth: 400 },
  {
    Header: "Forhåndsvis",
    accessor: "forhandsvisning",
    maxWidth: 150,
    minWidth: 50
  }
];

const Skjematabell: React.StatelessComponent<{
  data: { [emneord: string]: Skjema[] };
}> = props => {
  function innslagITabell(skjema: Skjema) {
    return {
      skjemanummer: (
        <HashLink
          smooth
          to={`detaljert/#${skjema.skjemanummer}`}
          className="lenke lenke--frittstaende"
        >
          {skjema.skjemanummer}
        </HashLink>
      ),
      skjemanavn: skjema.navn,
      sprak: "",
      forhandsvisning: (
        <div>
          {skjema.pdf ? (
            <a download={true} href={hentPdf(skjema)} className="sentrert">
              <HoverImg src={linjeDownloadIkon} onHover={fyltDownloadIkon} />
            </a>
          ) : (
            ""
          )}
        </div>
      )
    };
  }

  function hentPdf(skjema: Skjema) {
    const reg = new RegExp("file-(.*)-pdf");
    const regResultat = reg.exec(skjema.pdf.asset._ref);
    const sanityUrl = "http://cdn.sanity.io/files/gx9wf39f/skjemaveileder/"; // TEMP
    const fil = regResultat ? regResultat[1] : "";
    return sanityUrl + fil + ".pdf?dl";
  }

  function genererTabeller(): JSX.Element[] {
    let kolonneHeadersGittTema: Column[];
    let data: any[];
    let tabeller: JSX.Element[] = [];
    for (let emneord in props.data) {
      if (props.data.hasOwnProperty(emneord)) {
        kolonneHeadersGittTema = [{ Header: emneord, columns: innerColumns }];
        data = [];
        props.data[emneord].map(skjema => data.push(innslagITabell(skjema)));
        tabeller.push(
          <ReactTable
            className="typo-normal"
            key={emneord}
            data={data}
            columns={kolonneHeadersGittTema}
            showPagination={false}
            minRows={0}
          />
        );
      }
    }
    return tabeller;
  }

  return <>{genererTabeller()}</>;
};

export default Skjematabell;
