import * as React from "react";
import ReactTable, { Column } from "react-table";
import { HashLink } from "react-router-hash-link";
import { Skjema } from "../../../typer/skjemaogvedlegg";
import "react-table/react-table.css";

const innerColumns = [
  { Header: "ID", accessor: "skjemanummer" },
  { Header: "Navn på skjema", accessor: "skjemanavn" },
  { Header: "Målgruppe", accessor: "malgruppe" },
  { Header: "PDF", accessor: "pdf" }
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
          className="-striped -highlight typo-normal skjemautlisting__litenmargin-overunder"
          key={emneord}
          data={data}
          columns={kolonneHeadersGittTema}
          showPagination={false}
          minRows={0}
        />
      );
    }
  });
  return <div className="flex">{tabeller}</div>;
};

const innslagITabell = (skjema: Skjema) => {
  return {
    skjemanummer:
      skjema._type === "skjema" ? (
        <HashLink
          smooth={true}
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
    pdf: utlistingAvPDFerBasertPaSprak(skjema),
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
    case "sedskjema":
      return "Internasjonalt";
    default:
      return "Udefinert";
  }
};

export default Skjematabell;
