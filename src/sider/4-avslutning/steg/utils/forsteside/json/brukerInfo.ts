import {PersonaliaState} from "states/providers/Personalia";
import { Innsendingsmate } from "typer/soknad";
import { mottakerAdresse, enhetAdresse } from "./mottakerAdresse";
import { Klage } from "typer/store";

export const adresseOgBrukerInfo = (
  innsendingsmate: Innsendingsmate,
  personalia: PersonaliaState,
  skalKlage?: boolean,
  typeKlage?: Klage,
  skalAnke?: boolean
) => {
  const { fodselsnummer, adresse, bedrift } = personalia;
  const { flerePersonerEllerTiltaksbedrift } = bedrift;

  const enhet =
    fodselsnummer.valgtEnhet || adresse.valgtEnhet || bedrift.valgtEnhet;

  return {
    // Ruting klage eller anke
    ...((skalAnke || (skalKlage && typeKlage && typeKlage.erVideresendt)) && {
      enhetsnummer: enhet.enhetsnummer
    }),
    // Adresse og brukerinfo
    ...(flerePersonerEllerTiltaksbedrift
      ? // Bedrift
        flerePersonerEllerTiltaksbedrift === "flerepersoner"
        ? // Flere personer
          { ...enhetAdresse(enhet) }
        : // Tiltaksbedrift
            (innsendingsmate && innsendingsmate.skanning)
                ? {
                    enhetsnummer: enhet.enhetsnummer,
                    netsPostboks: "1400"
                }
                : {
                    ...enhetAdresse(enhet)
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
          ...mottakerAdresse(innsendingsmate, enhet)
        })
  };
};
