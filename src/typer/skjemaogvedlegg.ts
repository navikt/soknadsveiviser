import { LocaleBlockText, LocalePDFObjekt, LocaleString } from "./sprak";

export interface Vedleggsobjekt {
  _key: string;
  pakrevd?: boolean;
  situasjon?: LocaleString;
  beskrivelse?: LocaleBlockText;
  vedlegg: Vedlegg;
  skalSendes?: boolean;
  skalEttersendes?: boolean;
  soknadsobjektId?: string;
}

export interface Vedlegg {
  gosysid: string;
  kanskannes?: boolean;
  skjematilvedlegg?: Skjema;
  vedleggsid: string;
  navn: LocaleString;
  visningstittel: LocaleString;
}

export interface Skjema {
  navn: LocaleString;
  gyldigtil: LocaleString;
  gyldigfra: LocaleString;
  pdf: LocalePDFObjekt;
  skjemanummer: string;
  emneord: { emneord: string }[];
  _type?: string;
  visEtikett?: boolean;
  valgtSprak: string;
}
