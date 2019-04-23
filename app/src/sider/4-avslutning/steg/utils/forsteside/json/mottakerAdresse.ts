import { Innsendingsmate } from "../../../../../../typer/soknad";
export const mottakerAdresse = (innsendingsmate: Innsendingsmate) =>
  innsendingsmate &&
  (innsendingsmate.skanning
    ? {
        netsPostboks: "1400"
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
