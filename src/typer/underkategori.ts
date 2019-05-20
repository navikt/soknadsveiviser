import { Lenkeobjekt, Soknadsobjekt } from "./soknad";
import { LocaleBlockText, LocaleString } from "./sprak";

export interface Inngangsoknadsdialog {
  soknadsdialogURL?: LocaleString;
  beskrivelse?: LocaleBlockText;
  lenker?: Lenkeobjekt[];
}

export interface Underkategori {
  soknadsobjekter: Soknadsobjekt[];
  navn: LocaleString;
  urlparam: string;
  lenketilhorlighet: string;
  inngangtilsoknadsdialog: Inngangsoknadsdialog;
}
