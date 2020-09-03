import { KlageAnke } from "../typer/soknad";

export const kanKlage = (klageAnke: KlageAnke | undefined, type: string) =>
  klageAnke && klageAnke.kanKlage && type !== "bedrift";
