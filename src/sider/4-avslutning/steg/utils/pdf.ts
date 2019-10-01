import { b64toBlob } from "./blob";
import FileSaver from "file-saver";
import { LocalePDFObjekt } from "../../../../typer/sprak";

export const hentPDFurl = (
  pdfObjekt: LocalePDFObjekt,
  valgtLocale: string,
  globalLocale: string
) => hentPDFasset(pdfObjekt, valgtLocale, globalLocale).url;

export const hentPDFasset = (
  pdfObjekt: LocalePDFObjekt,
  valgtLocale: string,
  globalLocale: string
) => hentPDFobjekt(pdfObjekt, valgtLocale, globalLocale).asset;

export const hentPDFobjekt = (
  pdfObjekt: LocalePDFObjekt,
  valgtLocale: string,
  globalLocale: string
) => {
  // Generer url til hovedskjema og vedlegg
  const PDFsprak = pdfObjekt[valgtLocale]
    ? valgtLocale
    : pdfObjekt[globalLocale]
    ? globalLocale
    : `nb`;
  const pdf = pdfObjekt[PDFsprak];

  if (pdf) {
    return pdf;
  } else {
    throw new Error("Dokumentet har ikke et gyldig språk");
  }
};

export const lastNedFil = (url: string, tittel: string, filtype: string) => {
  console.log(`Laster ned ${tittel}`);
  try {
    FileSaver.saveAs(url, `${tittel}.${filtype}`);
  } catch (e) {
    console.error(e, `Klarte ikke å laste ned ${tittel}`);
  }
};

export const lastNedFilBase64 = (base64: string, tittel: string, filtype: string) => {
  console.log(`Laster ned ${tittel}`);
  try {
    FileSaver.saveAs(b64toBlob(base64), `${tittel}.${filtype}`);
  } catch (e) {
    console.error(e, `Klarte ikke å laste ned førstesideark.`);
  }
};
