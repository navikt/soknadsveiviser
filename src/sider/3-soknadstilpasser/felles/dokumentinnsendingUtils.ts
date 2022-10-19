import { Soknadsobjekt } from "../../../typer/soknad";
import { Vedlegg, Vedleggsobjekt } from "../../../typer/skjemaogvedlegg";
import { getTjenesteUrl } from "../../../config";

export const genererDokumentinnsendingsUrl = (
  valgtSoknadsobjekt: Soknadsobjekt,
  vedlegg: Vedleggsobjekt[],
  ettersendelse: boolean
) => {
  const { hovedskjema } = valgtSoknadsobjekt;

  // Send med skjemanummer dersom det eksisterer, ellers vedleggsid
  const hentSkjemanrEllerVedleggid = (vedlegg: Vedlegg) =>
    vedlegg.skjematilvedlegg
      ? vedlegg.skjematilvedlegg.skjemanummer
      : vedlegg.vedleggsid;

  const vedleggTilInnsending = vedlegg
    .filter(v => v.soknadsobjektId === valgtSoknadsobjekt._id)
    .filter(v => v.skalSendes || v.pakrevd)
    .map(({ vedlegg }) => hentSkjemanrEllerVedleggid(vedlegg))
    .join();

  return encodeURI(
    getTjenesteUrl() +
    "/sendinn/opprettSoknadResource?skjemanummer=" +
    hovedskjema.skjemanummer +
    "&erEttersendelse=" +
    (ettersendelse ? "true" : "false") +
    (vedleggTilInnsending ? "&vedleggsIder=" + vedleggTilInnsending : "")
  );
};
