import { Skjema } from "../../../../typer/skjemaogvedlegg";
import { HashLink } from "react-router-hash-link";
import * as React from "react";
import { convertNAVSkjemanummerTilHash } from "../../../../utils/hentSkjemanummerHash";

export const innslagITabell = (skjema: Skjema) => {
  return {
    key: skjema.skjemanummer,
    skjemanummer:
      skjema._type === "skjema" ? (
        <HashLink
          smooth={true}
          to={`detaljert#${convertNAVSkjemanummerTilHash(skjema.skjemanummer)}`}
          className="lenke lenke--frittstaende"
        >
          {skjema.skjemanummer}
        </HashLink>
      ) : (
        skjema.skjemanummer
      ),
    skjemanavn: skjema.navn.nb || skjema.navn.en,
    malgruppe: bestemMalgruppe(skjema._type),
    pdf: utlistingAvPDFerBasertPaSprak(skjema)
  };
};

export const utlistingAvPDFerBasertPaSprak = (skjema: Skjema) => {
  if (skjema.pdf) {
    return (
      <>
        <span>| </span>
        {Object.entries(skjema.pdf)
          .filter(([key, val]) => key && val && val.asset && val.asset.url)
          .map(([key, v]) => {
            return key && v && v.asset.url ? (
              <span key={skjema.skjemanummer + key}>
                <a
                  className="lenke"
                  href={v.asset.url}
                >
                  {key.toLocaleUpperCase()}
                </a>
                <span>{`  |  `}</span>
              </span>
            ) : (
              ""
            );
          })}
      </>
    );
  }
};

const bestemMalgruppe = (type?: string) => {
  switch (type) {
    case "skjema":
      return "På nav.no";
    case "interneskjema":
      return "Internt";
    case "sedskjema":
      return "Internasjonalt";
    default:
      return "Udefinert";
  }
};
