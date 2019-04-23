import { getSanityDataset, getProxyUrl } from "../../../../config";
import { sjekkForFeil } from "../../../../klienter/felles";
import { parseJson } from "../../../../klienter/parser";

export const hentPDFurl = (
  pdf: any,
  valgtLocale: string,
  globalLocale: string
) => {
  // Generer url til hovedskjema og vedlegg
  let PDFsprak = pdf[valgtLocale] ? valgtLocale : globalLocale;
  PDFsprak = pdf[`${PDFsprak}`] ? PDFsprak : `nb`;

  const reg = new RegExp("file-(.*)-pdf");
  const regResultat = reg.exec(pdf[`${PDFsprak}`].asset._ref);
  const sanityUrl = `http://cdn.sanity.io/files/gx9wf39f/${getSanityDataset()}/`;
  const fil = regResultat ? regResultat[1] : "";
  return sanityUrl + fil + ".pdf?dl";
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

export const lastNedPDF = (pdf: string) => {
  console.log("Laster ned sammenslått pdf");
  const linkSource = `data:application/pdf;base64,${pdf}`;
  const downloadLink = document.createElement("a");
  const fileName = "forside.pdf";

  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink); // for firefox
  downloadLink.click();
};
