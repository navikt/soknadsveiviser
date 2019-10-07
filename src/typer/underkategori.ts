import { Lenkeobjekt, Soknadsobjekt } from "./soknad";
import { LocaleBlockText, LocaleString } from "./sprak";

export interface Inngangsoknadsdialog {
  soknadsdialogURL?: LocaleString;
  beskrivelse?: LocaleBlockText;
  lenker?: Lenkeobjekt[];
  ettersendelse?: Ettersendelse;
}

export interface Underkategori {
  soknadsobjekter: Soknadsobjekt[];
  soknadslenker?: {navn: LocaleString, lenke: Lenkeobjekt, _id: string}[];
  navn: LocaleString;
  urlparam: string;
  lenketilhorlighet: string;
  inngangtilsoknadsdialog: Inngangsoknadsdialog;
}

interface Ettersendelse {
  ikkeVisEttersendelse: boolean;
  ettersendelsesURL?: LocaleString;
}
