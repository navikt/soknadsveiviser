import { Skjema } from "../../../../typer/skjemaogvedlegg";
import * as React from "react";
import { Column } from "react-table";
import { VisTabell } from "./Tabell";
import { innslagITabell } from "./innslagITabell";

export interface Tabell {
  data: any[];
  kolonneHeadersGittTema: Column[];
  emneord: string;
}

const Oversiktstabell = (props: {skjemaer: Skjema[]}) => {
  const { skjemaer } = props;

  const emneordMedSkjemaer = grupperSkjemaerOgEmneord(skjemaer);
  const generertTabelldata = genererTabelldata(emneordMedSkjemaer);
  const skjemaliste = genererSkjemaliste(skjemaer);

  return <VisTabell tabeller={generertTabelldata} skjemaliste={skjemaliste} />;
};

export default Oversiktstabell;

const grupperSkjemaerOgEmneord = (skjemaer: Skjema[]) => {
  const emneordMedSkjemaer: { [emneord: string]: Skjema[] } = {};
  const skjemaUtenEmneord = "Skjemaer uten emneord";

  skjemaer.map(skjema =>
    skjema.emneord
      ? skjema.emneord.map(emneord =>
        !emneordMedSkjemaer.hasOwnProperty(emneord.emneord)
          ? (emneordMedSkjemaer[emneord.emneord] = [skjema])
          : emneordMedSkjemaer[emneord.emneord].push(skjema)
      )
      : !emneordMedSkjemaer.hasOwnProperty(skjemaUtenEmneord)
        ? (emneordMedSkjemaer[skjemaUtenEmneord] = [skjema])
        : emneordMedSkjemaer[skjemaUtenEmneord].push(skjema)
  );

  return emneordMedSkjemaer;
};

const genererTabelldata = (emneordMedSkjemaer: { [emneord: string]: Skjema[] }) => {
  let kolonneHeadersGittTema: Column[];
  let data: any[];
  let tabeller: Tabell[] = [];

  Object.keys(emneordMedSkjemaer)
    .sort()
    .forEach(emneord => {
      if (emneordMedSkjemaer.hasOwnProperty(emneord)) {
        kolonneHeadersGittTema = [{ Header: emneord, columns: innerColumns }];
        data = [];
        emneordMedSkjemaer[emneord]
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

  return tabeller;
};

const genererSkjemaliste = (skjemaer: Skjema[]) => {
  const skjemaliste = skjemaer.map(skjema => {
    return {
      skjemanummer: skjema.skjemanummer,
      skjemanavn: skjema.navn ? skjema.navn.nb || "" : ""
    };
  });

  skjemaliste.unshift({
    skjemanummer: "Alle skjemaer",
    skjemanavn: ""
  });

  return skjemaliste;
};

const innerColumns = [
  { Header: "ID", accessor: "skjemanummer", maxWidth: 125 },
  { Header: "Navn på skjema", accessor: "skjemanavn" },
  { Header: "Målgruppe", accessor: "malgruppe", maxWidth: 125 },
  { Header: "PDF", accessor: "pdf", maxWidth: 200 }
];
