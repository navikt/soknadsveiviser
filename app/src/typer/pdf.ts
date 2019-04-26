export interface PDFObjekt {
  asset: {
    assetId: string;
    extension: string;
    mimeType: string;
    originalFilename: string;
    path: string;
    sha1hash: string;
    size: number;
    url: string;
    _createdAt: string;
    _id: string;
    _rev: string;
    _type: string;
    _updatedAt: string;
  };
}

export interface LocalePDFObjekt {
  [key: string]: PDFObjekt | undefined;
  nb?: PDFObjekt;
  en?: PDFObjekt;
  nn?: PDFObjekt;
  se?: PDFObjekt;
  fr?: PDFObjekt;
  es?: PDFObjekt;
  de?: PDFObjekt;
  pl?: PDFObjekt;
}
