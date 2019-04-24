import { getProxyUrl } from "../../../../config";
import { sjekkForFeil } from "../../../../klienter/felles";
import { parseJson } from "../../../../klienter/parser";
import { b64toBlob } from "./blob";
import FileSaver from "file-saver";

export const hentPDFurl = (
  pdf: any,
  valgtLocale: string,
  globalLocale: string
) => hentPDFasset(pdf, valgtLocale, globalLocale).url;

export const hentPDFasset = (
  pdf: any,
  valgtLocale: string,
  globalLocale: string
) => hentPDFobjekt(pdf, valgtLocale, globalLocale).asset;

export const hentPDFobjekt = (
  pdf: any,
  valgtLocale: string,
  globalLocale: string
) => {
  // Generer url til hovedskjema og vedlegg
  const PDFsprak = pdf[valgtLocale]
    ? valgtLocale
    : pdf[globalLocale]
    ? globalLocale
    : `nb`;

  return pdf[`${PDFsprak}`];
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
