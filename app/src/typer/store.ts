import { Kategori } from "./kategori";
import { Underkategori } from "./underkategori";
import { Soknader, Soknadsobjekt } from "./soknad";
import { Vedleggsobjekt } from "./vedlegg";
import { Loading, Result, HttpError, DataError } from "./api";

export interface Kategorier {
  valgtKategori: Kategori;
  valgtUnderkategori: Underkategori;
  alleKategorier: Kategori[];
}

export interface ValgtSoknad {
  valgtSoknadsobjekt: Soknadsobjekt;
  klageSoknadsobjekt?: Soknadsobjekt;
}

export type Vedlegg = {
  valgteVedlegg: Vedleggsobjekt[];
};

export type Klage = {
  skalEttersende: boolean;
};

export type FetchKategorier = { valgtType: "Person" | "Bedrift" } & (
  | Loading
  | (Result & Kategorier)
  | DataError
  | HttpError);

export type FetchSoknader =
  | Loading
  | (Result & Soknader)
  | DataError
  | HttpError;

export type FetchSoknad =
  | Loading
  | (Result & ValgtSoknad)
  | DataError
  | HttpError;

export interface Store {
  kategorier: FetchKategorier;
  soknader: FetchSoknader;
  valgtSoknad: FetchSoknad;
  vedlegg: Vedlegg;
  klage: Klage;
}
