import {Soknadsobjekt, Soknader, Innsendingsmate} from "../typer/soknad";
import {blockToPlainText, localeTekst} from "./sprak";
import {Vedleggsobjekt} from "../typer/skjemaogvedlegg";
import {LocaleString} from "../typer/sprak";

export const filtrerSoknadsojekt = (soknader: Soknader, skjemanummer: string) =>
  soknader.soknadsobjekter
    .filter(
      (soknadsobjekt: Soknadsobjekt) =>
        soknadsobjekt.hovedskjema.skjemanummer === skjemanummer
    )
    .shift();

export const finnesDigitalInnsending = (
  soknadsobjekt: Soknadsobjekt,
  locale: string
) =>
  finnesDokumentinnsending(soknadsobjekt) ||
  finnesInngangTilSoknadsdialog(soknadsobjekt, locale);

export const finnesDigitalEttersendelse = (
  soknadsobjekt: Soknadsobjekt,
  locale: string
) =>
  finnesDokumentinnsending(soknadsobjekt) ||
  (!!finnesInngangTilSoknadsdialog(soknadsobjekt, locale) &&
    finnesEttersendelseTilSoknadsdialog(soknadsobjekt));

export const finnesDokumentinnsending = (soknadsobjekt: Soknadsobjekt) =>
  soknadsobjekt.digitalinnsending &&
  soknadsobjekt.digitalinnsending.dokumentinnsending;

export const finnesInngangTilSoknadsdialog = (
  soknadsobjekt: Soknadsobjekt,
  locale: string
) =>
  soknadsobjekt.digitalinnsending &&
  soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog &&
  soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog.soknadsdialogURL &&
  soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog.soknadsdialogURL[
    locale
    ];

export const finnesFyllUtUrl = (soknadsobjekt: Soknadsobjekt,
                                locale: string) =>
  soknadsobjekt.digitalinnsending &&
  soknadsobjekt.digitalinnsending.fyllUt &&
  soknadsobjekt.digitalinnsending.fyllUt.lenker &&
  soknadsobjekt.digitalinnsending.fyllUt.lenker[locale];


export const finnesEttersendelseTilSoknadsdialog = (
  soknadsobjekt: Soknadsobjekt
) =>
  !(
    soknadsobjekt.digitalinnsending &&
    soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog &&
    soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog.ettersendelse &&
    soknadsobjekt.digitalinnsending.inngangtilsoknadsdialog.ettersendelse
      .ikkeVisEttersendelse
  );

export const finnesTilSkanning = (innsendingsmate?: Innsendingsmate) =>
  innsendingsmate && innsendingsmate.skanning;

export const finnesSpesifisertAdresse = (innsendingsmate?: Innsendingsmate) =>
  innsendingsmate && innsendingsmate.spesifisertadresse;

export const finnesVisEnheter = (
  locale: string,
  innsendingsmate?: Innsendingsmate
) =>
  innsendingsmate &&
  innsendingsmate.visenheter &&
  !innsendingsmate.skanning &&
  !innsendingsmate.spesifisertadresse &&
  blockToPlainText(innsendingsmate.visenheter, locale);

export const localeVedleggstittel = (
  vedleggsobjekt: Vedleggsobjekt,
  locale: string
) =>
  vedleggsobjekt.alternativtittel && vedleggsobjekt.alternativtittel[locale]
    ? localeTekst(vedleggsobjekt.alternativtittel, locale)
    : localeTekst(vedleggsobjekt.vedlegg.navn, locale);
