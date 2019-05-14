import { Skjema, Skjemaogvedlegg} from "../../../../../typer/skjemaogvedlegg";
import { localeTekst } from "../../../../../utils/sprak";

export const hentVedleggslisteForJoark = (
  vedleggsliste: Skjemaogvedlegg[],
  locale: string
) =>
  vedleggsliste.map(vedlegg =>
    vedlegg.skjematilvedlegg
      ? `${vedlegg.skjematilvedlegg.skjemanummer} ${vedlegg.skjematilvedlegg
          .navn.nb || vedlegg.skjematilvedlegg.navn[locale]}`
      : vedlegg.navn.nb || vedlegg.navn[locale]
  );

export const hentDokumentliste = (
  vedleggsliste: Skjemaogvedlegg[],
  hovedskjema: Skjema,
  locale: string,
  ettersendelse?: string
) => {
  const dokumentlisteTilVisning = vedleggsliste.map(vedlegg =>
    vedlegg.skjematilvedlegg
      ? `${vedlegg.skjematilvedlegg.skjemanummer} ${localeTekst(
          vedlegg.skjematilvedlegg.navn,
          locale
        )}`
      : localeTekst(vedlegg.navn, locale)
  );

  if (!ettersendelse) {
    dokumentlisteTilVisning.unshift(
      `${hovedskjema.skjemanummer} ${hovedskjema.navn[locale] ||
        hovedskjema.navn.nb}`
    );
  }

  return dokumentlisteTilVisning;
};
