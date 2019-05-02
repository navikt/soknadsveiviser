import { Soknadsobjekt, Soknader } from "../typer/soknad";

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
