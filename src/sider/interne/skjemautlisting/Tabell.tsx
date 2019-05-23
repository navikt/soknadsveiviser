import * as React from "react";
import ReactTable, { Column } from "react-table";
import { HashLink } from "react-router-hash-link";
import { Skjema } from "../../../typer/skjemaogvedlegg";
import "react-table/react-table.css";
import { useState } from "react";
import { Select } from "nav-frontend-skjema";

const innerColumns = [
  { Header: "ID", accessor: "skjemanummer", maxWidth: 125 },
  { Header: "Navn på skjema", accessor: "skjemanavn" },
  { Header: "Målgruppe", accessor: "malgruppe", maxWidth: 125 },
  { Header: "PDF", accessor: "pdf", maxWidth: 200 }
];

interface Props {
  data: { [emneord: string]: Skjema[] };
}

interface Tabell {
  tabell: JSX.Element;
  emneord: string;
}

const Skjematabell = (props: Props) => {
  let kolonneHeadersGittTema: Column[];
  let data: any[];
  let tabeller: Tabell[] = [];

  Object.keys(props.data)
    .sort()
    .forEach(emneord => {
      if (props.data.hasOwnProperty(emneord)) {
        kolonneHeadersGittTema = [{ Header: emneord, columns: innerColumns }];
        data = [];
        props.data[emneord]
          .sort((skjemaa, skjemab) =>
            skjemaa.skjemanummer > skjemab.skjemanummer ? 1 : -1
          )
          .map(skjema => data.push(innslagITabell(skjema)));
        tabeller.push({
          tabell: (
            <ReactTable
              className="-striped -highlight typo-normal skjemautlisting__litenmargin-overunder"
              key={emneord}
              data={data}
              columns={kolonneHeadersGittTema}
              showPagination={false}
              minRows={1}
              defaultPageSize={10000} // skal være "uendelig"
            />
          ),
          emneord: emneord
        });
      }
    });
  return <VisTabell tabeller={tabeller} />;
};

const VisTabell = (props: { tabeller: Tabell[] }) => {
  const [valgtEmneord, settValgtEmneord] = useState("Alle");
  const { tabeller } = props;
  return (
    <>
      <Select
        label="Velg skjemaer for:"
        bredde={"xxl"}
        value={valgtEmneord}
        onChange={event => settValgtEmneord(event.currentTarget.value)}
      >
        <option key="alle" value="Alle">
          Alle
        </option>
        {tabeller.map(tabell => (
          <option key={tabell.emneord} value={tabell.emneord}>
            {tabell.emneord}
          </option>
        ))}
      </Select>
      <div className="flex">
        {valgtEmneord === "Alle"
          ? tabeller.map(tabell => tabell.tabell)
          : tabeller.filter(tabell => tabell.emneord === valgtEmneord)[0]
              .tabell}
      </div>
    </>
  );
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
    pdf: utlistingAvPDFerBasertPaSprak(skjema)
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
