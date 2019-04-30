import { Vedleggsobjekt } from "./vedlegg";
import { Inngangsoknadsdialog } from "./underkategori";
import { Skjema } from "../sider/4-avslutning/steg/SkjemaVisning";
import { SprakBlockText, SprakString } from "./sprak";

export interface DigitalInnsending {
  dokumentinnsending?: boolean;
  inngangtilsoknadsdialog?: Inngangsoknadsdialog;
}

export interface Soknadsobjekt {
  _id: string;
  navn: SprakString;
  beskrivelse?: SprakBlockText;
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
  navn: SprakString;
  lenke: Lenkeobjekt;
  beskrivelse?: SprakBlockText;
  infoLenker?: Lenkeobjekt[];
}

export interface Soknader {
  soknadsobjekter: Soknadsobjekt[];
  soknadslenker: Soknadslenke[];
}

export interface Innsendingsmate {
  skanning?: boolean;
  spesifisertadresse?: Adresse;
  brukerVelgerSelv?: SprakBlockText;
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
  tekst: SprakString;
  lenke: SprakString; // burde hete url
}
