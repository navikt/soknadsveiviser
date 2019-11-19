import { Vedleggsobjekt } from "typer/skjemaogvedlegg";

export const scrollTilNesteSpm = (hash: string, vedlegg: Vedleggsobjekt[]) => {
  // Kun scroll til neste spørsmål dersom det ikke er besvart
  const nesteSpmElement = document.getElementById(hash);
  const nesteSpmNummer = parseInt(hash.split("#")[1], 10);
  const nesteEksisterer = nesteSpmNummer < vedlegg.length;

  if (nesteSpmElement && nesteEksisterer) {
    // Gå til liste
    const nesteSpmErUbesvart =
      vedlegg[nesteSpmNummer - 1].skalSendes === undefined;

    // Scroll
    if (nesteSpmErUbesvart) {
      nesteSpmElement.scrollIntoView({
        behavior: "smooth"
      });
    }
  }
};
