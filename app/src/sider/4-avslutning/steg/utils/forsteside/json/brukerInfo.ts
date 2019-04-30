import { Personalia } from "../../../../../../states/providers/Personalia";
import { Innsendingsmate } from "../../../../../../typer/soknad";
import { mottakerAdresse, enhetAdresse } from "./mottakerAdresse";

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
        { ...enhetAdresse(enhet) }
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
                (adresse.kontaktetEnhet
                  ? ` Har tidligere vært i kontakt med ${
                      adresse.kontaktetEnhet.label
                    } om saken`
                  : "")
            }),
        ...mottakerAdresse(innsendingsmate, enhet)
      };
};
