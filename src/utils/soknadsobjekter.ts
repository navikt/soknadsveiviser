import { Soknadsobjekt, Soknader, Innsendingsmate } from "../typer/soknad";
import { blockToPlainText } from "./sprak";

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
