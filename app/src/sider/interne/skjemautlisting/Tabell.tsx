import * as React from "react";
import ReactTable, { Column } from "react-table";
import { HashLink } from "react-router-hash-link";
import HoverImg from "../../../utils/hoverImg";
import { Skjema } from "../../../typer/skjemaogvedlegg";

const linjeDownloadIkon = require("../../../img/line-version-download-1.svg");
const fyltDownloadIkon = require("../../../img/filled-version-download-1.svg");

const innerColumns = [
  { Header: "ID", accessor: "skjemanummer", maxWidth: 125 },
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

interface Props {
  data: { [emneord: string]: Skjema[] };
}

const Skjematabell = (props: Props) => {
  let kolonneHeadersGittTema: Column[];
  let data: any[];
  let tabeller: JSX.Element[] = [];

  Object.keys(props.data).forEach(emneord => {
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
  });
  return <>{tabeller}</>;
};

const innslagITabell = (skjema: Skjema) => {
  return {
    skjemanummer:
      skjema._type === "skjema" ? (
        <HashLink
          smooth
          to={`detaljert/#${skjema.skjemanummer}`}
          className="lenke lenke--frittstaende"
        >
          {skjema.skjemanummer}
        </HashLink>
      ) : (
        skjema.skjemanummer
      ),
    skjemanavn: skjema.navn,
    malgruppe: bestemMalgruppe(skjema._type),
    sprak: utlistingAvPDFerBasertPaSprak(skjema),
    forhandsvisning: (
      <div key={skjema.skjemanummer}>
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
};

const utlistingAvPDFerBasertPaSprak = (skjema: Skjema) => {
  if (skjema.pdf) {
    return (
      <>
        <span>| </span>
        {Object.entries(skjema.pdf)
          .filter(([key, val]) => key && val && val.asset && val.asset.url)
          .map(([key, v]) => {
            return key && v && v.asset.url ? (
              <>
                <a
                  className="lenke"
                  key={skjema.skjemanummer + key}
                  href={v.asset.url}
                >
                  {key.toLocaleUpperCase()}
                </a>
                <span>{`  |  `}</span>
              </>
            ) : (
              ""
            );
          })}
      </>
    );
  }
};

const bestemMalgruppe = (type?: string) => {
  switch (type) {
    case "skjema":
      return "På nav.no";
    case "interneskjema":
      return "Internt";
    case "eessiskjema":
      return "Internasjonalt";
    default:
      return "Udefinert";
  }
};

const hentPdf = (skjema: Skjema) => skjema.pdf!.nb!.asset!.url;

export default Skjematabell;
