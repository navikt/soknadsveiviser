import { Soknadsobjekt, Soknader } from "../typer/soknad";

export const filtrerSoknadsojekt = (soknader: Soknader, skjemanummer: string) =>
  soknader.soknadsobjekter
    .filter(
      (soknadsobjekt: Soknadsobjekt) =>
        soknadsobjekt.hovedskjema.skjemanummer === skjemanummer
    )
    .shift();
