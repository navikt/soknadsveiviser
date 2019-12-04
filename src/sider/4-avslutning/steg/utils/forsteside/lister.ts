import {
  Skjema,
  Vedlegg,
  Vedleggsobjekt
} from "../../../../../typer/skjemaogvedlegg";
import { localeTekst } from "../../../../../utils/sprak";
import { localeVedleggstittel } from "../../../../../utils/soknadsobjekter";

export const hentVedleggslisteForJoark = (
  vedleggsliste: Vedlegg[],
  locale: string
) =>
  vedleggsliste.map(vedlegg =>
    vedlegg.skjematilvedlegg
      ? `${vedlegg.skjematilvedlegg.skjemanummer} ${vedlegg.skjematilvedlegg
          .navn.nb || vedlegg.skjematilvedlegg.navn[locale]}`
      : vedlegg.navn.nb || vedlegg.navn[locale]
  );

export const hentDokumentliste = (
  vedleggsobjektliste: Vedleggsobjekt[],
  hovedskjema: Skjema,
  locale: string,
  ettersendelse: boolean
) => {
  const dokumentlisteTilVisning = vedleggsobjektliste.map(vedleggsobjekt => {
    const { vedlegg } = vedleggsobjekt;
    return vedlegg.skjematilvedlegg
      ? `${vedlegg.skjematilvedlegg.skjemanummer} ${localeTekst(
          vedlegg.skjematilvedlegg.navn,
          locale
        )}`
      : localeVedleggstittel(vedleggsobjekt, locale);
  });

  if (!ettersendelse) {
    dokumentlisteTilVisning.unshift(
      `${hovedskjema.skjemanummer} ${hovedskjema.navn[locale] ||
        hovedskjema.navn.nb}`
    );
  }

  return dokumentlisteTilVisning;
};
