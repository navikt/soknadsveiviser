import { LocaleString, LocaleBlockText } from "../typer/sprak";

const ingenTekst = "Feil, fant ikke tekst";
const udefinertTekst = "Udefinert tekst på objektet";

const ingenTekstForBlock = {
  _key: "00",
  _type: "block",
  children: [
    {
      _key: "0",
      _type: "span",
      marks: [],
      text: ""
    }
  ]
};

export const localeTekst = (object: LocaleString, locale: string) =>
  object ? object[locale] || object.nb || ingenTekst : udefinertTekst;

export const localeBlockTekst = (object: LocaleBlockText, locale: string) =>
  object[locale] || object.nb || ingenTekstForBlock;

export const storForsteBokstav = (setning: string) =>
  setning.charAt(0).toUpperCase() + setning.slice(1).toLowerCase();

export const sideTittel = (tittel: string) => `${tittel} - www.nav.no`;

export const blockToPlainText = (
  sprakBlock: LocaleBlockText,
  locale: string
) => {
  const blocks = sprakBlock[locale] || sprakBlock.nb;
  return blocks
    ? blocks
        .map(block => {
          if (block._type !== "block" || !block.children) {
            return false;
          }
          return block.children.map((child: any) => child.text).join("");
        })
        // join the parapgraphs leaving split by two linebreaks
        .join("\n\n")
    : false;
};
