import * as React from "react";
import ReactTable, { Column } from "react-table";
import { HashLink } from "react-router-hash-link";
import { Skjema } from "../../../typer/skjemaogvedlegg";
import "react-table/react-table.css";
import { useState } from "react";
import { Select as NAVSelect } from "nav-frontend-skjema";
import Select from "react-select";
import { Normaltekst } from "nav-frontend-typografi";

const innerColumns = [
  { Header: "ID", accessor: "skjemanummer", maxWidth: 125 },
  { Header: "Navn på skjema", accessor: "skjemanavn" },
  { Header: "Målgruppe", accessor: "malgruppe", maxWidth: 125 },
  { Header: "PDF", accessor: "pdf", maxWidth: 200 }
];

interface Props {
  data: { [emneord: string]: Skjema[] };
  skjemaliste: { skjemanavn: string; skjemanummer: string }[];
}

interface Tabell {
  data: any[];
  kolonneHeadersGittTema: Column[];
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
          data: data,
          kolonneHeadersGittTema: kolonneHeadersGittTema,
          emneord: emneord
        });
      }
    });

  props.skjemaliste.unshift({
    skjemanummer: "Alle skjemaer",
    skjemanavn: ""
  });
  return <VisTabell tabeller={tabeller} skjemaliste={props.skjemaliste} />;
};

const VisTabell = (props: {
  tabeller: Tabell[];
  skjemaliste: { skjemanummer: string; skjemanavn: string }[];
}) => {
  const alleSkjema = { skjemanummer: "Alle skjemaer", skjemanavn: "" };
  const alleEmneord = "Alle";

  const [valgtEmneord, settValgtEmneord] = useState(alleEmneord);
  const [valgtSkjema, settValgtSkjema] = useState(alleSkjema);

  const { tabeller } = props;

  const endeligTabell =
    valgtEmneord === alleEmneord
      ? valgtSkjema.skjemanummer === alleSkjema.skjemanummer
        ? tabeller
        : tabeller
            .map(tabell => {
              return {
                ...tabell,
                data: tabell.data.filter(
                  data => data.skjemanavn === valgtSkjema.skjemanavn
                )
              };
            })
            .filter(tabell => tabell.data.length > 0)
      : tabeller.filter(tabell => tabell.emneord === valgtEmneord);


  const settSkjema = (selected: any) => {
    settValgtEmneord("Alle");
    settValgtSkjema(selected["value"]);
  };

  const settEmneord = (selected: any) => {
    settValgtEmneord(selected.currentTarget.value);
    settValgtSkjema(alleSkjema);
  };

  return (
    <>
      <div className="skjemautlisting__paneler">
        <NAVSelect
          className="skjemautlisting__select--padding"
          label="Velg skjemaer for:"
          bredde={"xxl"}
          value={valgtEmneord}
          onChange={settEmneord}
        >
          <option key="alle" value="Alle">
            Alle områder
          </option>
          {tabeller.map(tabell => (
            <option key={tabell.emneord} value={tabell.emneord}>
              {tabell.emneord}
            </option>
          ))}
        </NAVSelect>
        <div style={{"width": "50%"}}>
          <Normaltekst className="skjemautlisting__selectlabel--padding">
            Søk etter skjema:
          </Normaltekst>
          <Select
            onChange={settSkjema}
            value={{
              value: valgtSkjema,
              label: `${valgtSkjema.skjemanummer} ${valgtSkjema.skjemanavn}`
            }}
            options={props.skjemaliste.map(skjema => ({
              value: skjema,
              label: `${skjema.skjemanummer} ${skjema.skjemanavn}`
            }))}
          />
        </div>
      </div>
      <div className="flex">
        {endeligTabell ? (
          endeligTabell.map(tabell => (
            <ReactTable
              className="-striped -highlight typo-normal skjemautlisting__litenmargin-overunder"
              key={tabell.emneord}
              data={tabell.data}
              columns={tabell.kolonneHeadersGittTema}
              showPagination={false}
              minRows={1}
              defaultPageSize={10000} // skal være "uendelig"
            />
          ))
        ) : (
          <Normaltekst>Fant ingen skjemaer</Normaltekst>
        )}
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
    skjemanavn: skjema.navn.nb || skjema.navn.en,
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
