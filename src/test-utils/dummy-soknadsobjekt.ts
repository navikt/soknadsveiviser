import { Adresse, Innsendingsmate, Soknadsobjekt, Tema } from "../typer/soknad";
import { LocaleBlockText, LocalePDFObjekt } from "../typer/sprak";
import { createDummyLocalePDFObject } from "./dummy-pdf";

const DEFAULT_LOCALE = "nb";

export function createDummyInnsendingsmate(
  skanning?: boolean = true,
  spesifisertadresse?: Adresse,
  visenheter?: LocaleBlockText
): Innsendingsmate {
  return {
    skanning,
    spesifisertadresse,
    visenheter,
  };
}

export function createDummyTema(navn: string = "", temakode: string = ""): Tema {
  return {
    navn,
    temakode,
  };
}

export function createDummyHovedskjema(skjemanummer: string = "skjema-nummer", locale: string = DEFAULT_LOCALE) {
  return {
    navn: {
      [locale]: "",
    },
    gyldigtil: {
      [locale]: "",
    },
    gyldigfra: {
      [locale]: "",
    },
    pdf: createDummyLocalePDFObject(),
    skjemanummer,
    emneord: [
      {
        emneord: "",
      },
    ],
    valgtSprak: locale,
  };
}

export function createDummyInngangtilsoknadsdialog(soknadsdialogURL?: string | null, locale: string = DEFAULT_LOCALE) {
  return {
    soknadsdialogURL: {
      [locale]: soknadsdialogURL,
    },
  };
}

export function createDummyFyllUt(fyllUtURL?: string | null, locale: string = DEFAULT_LOCALE) {
  return {
    lenker: {
      [locale]: fyllUtURL,
    },
  };
}

export function createDummyDigitalinnsending(
  soknadsdialogURL?: string,
  dokumentInnsending?: boolean,
  fyllUtURL?: string,
  locale: string = DEFAULT_LOCALE
) {
  return {
    dokumentinnsending: dokumentInnsending,
    inngangtilsoknadsdialog: createDummyInngangtilsoknadsdialog(soknadsdialogURL, locale),
    fyllUt: createDummyFyllUt(fyllUtURL, locale),
  };
}

export function createDummySoknadsobjekt(
  soknadsdialogURL?: string | null,
  dokumentInnsending?: boolean,
  fyllUtURL?: string | null,
  locale: string = DEFAULT_LOCALE
): Soknadsobjekt {
  return {
    _id: "",
    navn: {
      [locale]: "",
    },
    gosysid: 1,
    tema: createDummyTema(),
    urlparam: "",
    vedleggtilsoknad: [],
    innsendingsmate: createDummyInnsendingsmate(),
    brukertyper: [],
    hovedskjema: createDummyHovedskjema(),
    digitalinnsending: createDummyDigitalinnsending(soknadsdialogURL, dokumentInnsending, fyllUtURL, locale),
  };
}
