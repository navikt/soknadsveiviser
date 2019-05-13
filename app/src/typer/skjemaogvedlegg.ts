import { LocaleBlockText, LocalePDFObjekt, LocaleString } from "./sprak";

export interface Vedleggsobjekt {
  _key: string;
  pakrevd?: boolean;
  situasjon?: LocaleString;
  beskrivelse?: LocaleBlockText;
  vedlegg: Skjemaogvedlegg;
  skalSendes?: boolean;
  skalEttersendes?: boolean;
  soknadsobjektId?: string;
}

export interface Skjemaogvedlegg {
  gosysid: string;
  kanskannes?: boolean;
  skjematilvedlegg?: Skjema;
  vedleggsid: string;
  navn: LocaleString;
  beskrivelse?: LocaleBlockText;
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
