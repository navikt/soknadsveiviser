import { Innsendingsmate } from "../../../../../../typer/soknad";
import { Enhet } from "../../../../../../typer/enhet";

export const mottakerAdresse = (
  innsendingsmate: Innsendingsmate,
  enhet?: Enhet
) =>
  innsendingsmate &&
  (innsendingsmate.skanning
    ? {
        netsPostboks: "1400"
      }
    : innsendingsmate.visenheter && enhet
    ? {
        ...enhetAdresse(enhet)
      }
    : innsendingsmate.spesifisertadresse
    ? {
        adresse: innsendingsmate.spesifisertadresse
      }
    : {
        adresse: {
          adresselinje1: `Det skjedde en feil med opprettelse av mottakeradresse`,
          postnummer: "-",
          poststed: "-"
        }
      });

export const enhetAdresse = (enhet: Enhet) => ({
  adresse: {
    adresselinje1: enhet.enhetsnavn,
    adresselinje2: enhet.postboks
      ? "Postboks " + enhet.postboks
      : `${enhet.postGatenavn || ""} ` +
        (enhet.postHusnummer || "") +
        (enhet.postHusbokstav || ""),
    postnummer: enhet.postnummer,
    poststed: enhet.poststed
  }
});
