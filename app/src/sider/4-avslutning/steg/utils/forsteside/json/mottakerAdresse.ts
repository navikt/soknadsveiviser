import { Innsendingsmate } from "../../../../../../typer/soknad";
import { Enhet } from "../../../../../../typer/enhet";
import {SprakString} from "../../../../../../typer/sprak";

export const mottakerAdresse = (
  innsendingsmate: Innsendingsmate,
  soknadsobjektnavn: SprakString,
  enhet?: Enhet
) => {
  if (innsendingsmate) {
    if (innsendingsmate.skanning) {
      return(
        {
          netsPostboks: "1400"
        }
      );
    }

    if (innsendingsmate.spesifisertadresse) {
      return(
        {
          adresse: innsendingsmate.spesifisertadresse
        }
      );
    }

    if (innsendingsmate.visenheter && enhet) {
      return(
        {
          ...enhetAdresse(enhet)
        }
      );
    }
  }
  
  console.warn(`Fant ikke adresseinformasjon for søknadsobjektet ${soknadsobjektnavn.nb}`);
  return(
    {
      netsPostboks: "1400"
    }
  );
};

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
