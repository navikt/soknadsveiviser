import { Klage } from "../typer/store";

export const erKlageEllerAnkeOgSkalSendesTilKlageinstans =
  (skalKlage: boolean | undefined, typeKlage: Klage | undefined, skalAnke: boolean | undefined) =>
    (skalKlage && typeKlage && typeKlage.erVideresendt) || skalAnke;
