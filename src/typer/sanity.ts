export type IdObjekt = {
  _id: string;
};

export type SanityObjekt = IdObjekt & {
  _key: string;
  _type: string;
};

export type SanityObjektMedUrl = { urlparam: string } & SanityObjekt;

export type SanityDokument = IdObjekt & {
  _createAt: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
};

export type SanityDokumentMedUrl = { urlparam: string } & SanityDokument;
