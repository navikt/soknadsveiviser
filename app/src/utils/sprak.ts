import { SprakString, SprakBlockText } from "../typer/sprak";

const ingenTekst = "Feil, fant ikke tekst";
const udefinertTekst = "Udefinert tekst på objektet";

const ingenTekstForBlock = {
  "_key": "00",
  "_type": "block",
  "children": [{
    "_key": "0",
    "_type": "span",
    "marks": [],
    "text": ""
  }]
};

export const localeTekst = (object: SprakString, locale: string) =>
  object ? object[locale] || object.nb || ingenTekst : udefinertTekst;

export const localeBlockTekst = (object: SprakBlockText, locale: string) =>
  object[locale] || object.nb || ingenTekstForBlock;
