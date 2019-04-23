import { Lenkeobjekt, Soknadsobjekt } from "./soknad";
import { SprakBlockText, SprakString } from "./sprak";

export interface Inngangsoknadsdialog {
  soknadsdialogURL?: SprakString;
  beskrivelse?: SprakBlockText;
  lenker?: Lenkeobjekt[];
}

export interface Underkategori {
  soknadsobjekter: Soknadsobjekt[];
  navn: SprakString;
  urlparam: string;
  lenketilhorlighet: string;
  inngangtilsoknadsdialog: Inngangsoknadsdialog;
}
