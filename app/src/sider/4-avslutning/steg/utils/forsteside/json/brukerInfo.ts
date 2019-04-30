import { Personalia } from "../../../../../../states/providers/Personalia";
import { Innsendingsmate } from "../../../../../../typer/soknad";
import { mottakerAdresse } from "./mottakerAdresse";

export const adresseOgBrukerInfo = (
  innsendingsmate: Innsendingsmate,
  personalia: Personalia
) => {
  const { bedrift } = personalia;
  const { flerePersonerEllerTiltaksbedrift } = bedrift;
  const { fodselsnummer, adresse } = personalia;
  const enhet = bedrift.valgtEnhet && bedrift.valgtEnhet.value;

  return flerePersonerEllerTiltaksbedrift
    ? // Bedrift
      flerePersonerEllerTiltaksbedrift === "flerepersoner"
      ? // Flere personer
        {
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
        }
      : // Tiltaksbedrift
        {
          enhetsnummer: enhet.enhetsnummer,
          ...mottakerAdresse(innsendingsmate)
        }
    : // Personbruker
      {
        ...(fodselsnummer
          ? {
              bruker: {
                brukerId: fodselsnummer,
                brukerType: "PERSON"
              }
            }
          : adresse && {
              ukjentBrukerPersoninfo:
                `${adresse.navn || ""}, ` +
                `${adresse.adresse || ""} ` +
                `${adresse.postnummer || ""} ` +
                `${adresse.sted || ""} ` +
                `${adresse.land || ""}. ` +
                (adresse.valgtEnhet
                  ? ` Har tidligere vært i kontakt med ${
                      adresse.valgtEnhet.label
                    } om saken`
                  : "")
            }),
        ...mottakerAdresse(innsendingsmate)
      };
};
