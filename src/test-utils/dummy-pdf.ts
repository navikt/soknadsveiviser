import { LocalePDFObjekt } from "../typer/sprak";
import { PDFObjekt } from "../typer/pdf";

export function createDummyPDFObject(): PDFObjekt {
  return {
    asset: {
      assetId: "",
      extension: "",
      mimeType: "",
      originalFilename: "",
      path: "",
      sha1hash: "",
      size: 1,
      url: "",
      _createdAt: "",
      _id: "",
      _rev: "",
      _type: "",
      _updatedAt: "",
    },
  };
}

export function createDummyLocalePDFObject(locale: string = "nb"): LocalePDFObjekt {
  return {
    [locale]: createDummyPDFObject(),
  };
}
