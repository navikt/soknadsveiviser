import { Skjema, Vedleggsobjekt } from "./skjemaogvedlegg";
import { Inngangsoknadsdialog } from "./underkategori";
import { LocaleBlockText, LocaleString } from "./sprak";

export interface DigitalInnsending {
  dokumentinnsending?: boolean;
  inngangtilsoknadsdialog?: Inngangsoknadsdialog;
}

export interface Soknadsobjekt {
  _id: string;
  navn: LocaleString;
  beskrivelse?: LocaleBlockText;
  gosysid: number;
  hovedskjema: Skjema;
  vedleggtilsoknad: Vedleggsobjekt[];
  digitalinnsending?: DigitalInnsending;
  lenker?: Lenkeobjekt[];
  tema: Tema;
  urlparam: string;
  innsendingsmate: Innsendingsmate;
}

export interface Soknadslenke {
  _id: string;
  navn: LocaleString;
  lenke: Lenkeobjekt;
  beskrivelse?: LocaleBlockText;
  infoLenker?: Lenkeobjekt[];
}

export interface Soknader {
  soknadsobjekter: Soknadsobjekt[];
  soknadslenker: Soknadslenke[];
}

export interface Innsendingsmate {
  skanning?: boolean;
  spesifisertadresse?: Adresse;
  visenheter?: LocaleBlockText;
}

export interface Adresse {
  adresselinje1: string;
  adresselinje2: string;
  adresselinje3: string;
  postnummer: string;
  poststed: string;
}

export interface Tema {
  navn: string;
  temakode: string;
}

export interface Lenkeobjekt {
  tekst: LocaleString;
  lenke: LocaleString; // burde hete url
}
