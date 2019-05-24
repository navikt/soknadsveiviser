import { Skjema } from "../../../../typer/skjemaogvedlegg";
import { HashLink } from "react-router-hash-link";
import * as React from "react";

export const innslagITabell = (skjema: Skjema) => {
  return {
    skjemanummer:
      skjema._type === "skjema" ? (
        <HashLink
          smooth={true}
          to={`detaljert/#${skjema.skjemanummer}`}
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

const utlistingAvPDFerBasertPaSprak = (skjema: Skjema) => {
  if (skjema.pdf) {
    return (
      <>
        <span>| </span>
        {Object.entries(skjema.pdf)
          .filter(([key, val]) => key && val && val.asset && val.asset.url)
          .map(([key, v]) => {
            return key && v && v.asset.url ? (
              <>
                <a
                  className="lenke"
                  key={skjema.skjemanummer + key}
                  href={v.asset.url}
                >
                  {key.toLocaleUpperCase()}
                </a>
                <span>{`  |  `}</span>
              </>
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
