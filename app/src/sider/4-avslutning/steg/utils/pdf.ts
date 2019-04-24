import { getProxyUrl } from "../../../../config";
import { sjekkForFeil } from "../../../../klienter/felles";
import { parseJson } from "../../../../klienter/parser";
import { b64toBlob } from "./blob";
import FileSaver from "file-saver";
import { LocalePDFObjekt } from "../../../../typer/pdf";

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

export const mergePDF = (
  foersteside: string,
  pdfListe: string[]
): Promise<string> =>
  new Promise((resolve, reject) => {
    console.group("Sammenslåing av pdfer");
    console.log("Førstesiden, søknader og vedlegg");
    console.log(pdfListe);
    console.groupEnd();
    const url = `${getProxyUrl()}/merge-pdf`;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ foersteside, pdfListe })
    })
      .then(response => sjekkForFeil(url, response, reject))
      .then(parseJson)
      .then(json => resolve(json.pdf))
      .catch(reject);
  });

export const lastNedPDF = (pdf: string, title: string) => {
  console.log("Laster ned sammenslått pdf");
  FileSaver.saveAs(b64toBlob(pdf), `${title}.pdf`);
};
