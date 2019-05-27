import { Skjema } from "../../../../typer/skjemaogvedlegg";
import * as React from "react";
import { Column } from "react-table";
import VisTabell from "./Tabell";
import { innslagITabell } from "./innslagITabell";
import { InjectedIntlProps, injectIntl } from "react-intl";

export interface Tabell {
  data: any[];
  kolonneHeadersGittTema: Column[];
  emneord: string;
}

const Oversiktstabell = (props: { skjemaer: Skjema[] } & InjectedIntlProps) => {
  const { skjemaer, intl } = props;
  const skjemautenEmneordHeader = intl.formatMessage({id: "skjemautlisting.tabell.skjemautenemneord"});
  const skjemanummerHeader = intl.formatMessage({id: "skjemautlisting.tabell.skjemanummer"});
  const skjemanavnHeader = intl.formatMessage({id: "skjemautlisting.tabell.skjemanavn"});
  const malgruppeHeader = intl.formatMessage({id: "skjemautlisting.tabell.malgruppe"});
  const PDFHeader = intl.formatMessage({id: "skjemautlisting.tabell.pdf"});

  const innerColumns = [
    { Header: skjemanummerHeader, accessor: "skjemanummer", maxWidth: 125 },
    { Header: skjemanavnHeader, accessor: "skjemanavn" },
    { Header: malgruppeHeader, accessor: "malgruppe", maxWidth: 125 },
    { Header: PDFHeader, accessor: "pdf", maxWidth: 200 }
  ];

  const emneordMedSkjemaer = grupperSkjemaerOgEmneord(
    skjemaer,
    skjemautenEmneordHeader
  );
  const generertTabelldata = genererTabelldata(
    emneordMedSkjemaer,
    innerColumns
  );
  const skjemaliste = genererSkjemaliste(skjemaer);

  return <VisTabell tabeller={generertTabelldata} skjemaliste={skjemaliste} />;
};

export default injectIntl(Oversiktstabell);

const grupperSkjemaerOgEmneord = (
  skjemaer: Skjema[],
  skjemaUtenEmneord: string
) => {
  const emneordMedSkjemaer: { [emneord: string]: Skjema[] } = {};

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

const genererTabelldata = (
  emneordMedSkjemaer: {
    [emneord: string]: Skjema[];
  },
  innerColumns: Column[]
) => {
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

const genererSkjemaliste = (skjemaer: Skjema[]) =>
  skjemaer.map(skjema => {
    return {
      skjemanummer: skjema.skjemanummer,
      skjemanavn: skjema.navn ? skjema.navn.nb || "" : ""
    };
  });
