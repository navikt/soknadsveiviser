import { Personalia } from "../../../../../../states/providers/Personalia";
import { Innsendingsmate } from "../../../../../../typer/soknad";
import { mottakerAdresse, enhetAdresse } from "./mottakerAdresse";
import {SprakString} from "../../../../../../typer/sprak";

export const adresseOgBrukerInfo = (
  innsendingsmate: Innsendingsmate,
  personalia: Personalia,
  soknadsobjektnavn: SprakString,
) => {
  const { fodselsnummer, adresse, bedrift } = personalia;
  const { flerePersonerEllerTiltaksbedrift } = bedrift;

  const enhet =
    fodselsnummer.valgtEnhet || adresse.valgtEnhet || bedrift.valgtEnhet;

  return flerePersonerEllerTiltaksbedrift
    ? // Bedrift
      flerePersonerEllerTiltaksbedrift === "flerepersoner"
      ? // Flere personer
        { ...enhetAdresse(enhet) }
      : // Tiltaksbedrift
        {
          enhetsnummer: enhet.enhetsnummer,
          ...mottakerAdresse(innsendingsmate, soknadsobjektnavn)
        }
    : // Personbruker
      {
        ...(fodselsnummer.fodselsnummer
          ? {
              bruker: {
                brukerId: fodselsnummer.fodselsnummer,
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
                      adresse.kontaktetEnhet.enhetsnavn
                    } - ${adresse.kontaktetEnhet.enhetsnummer} om saken`
                  : "")
            }),
        ...mottakerAdresse(innsendingsmate, soknadsobjektnavn, enhet)
      };
};
