import { Kategori } from "../typer/kategori";

export const erKategoriValgt = (kategori: Kategori, valgtKategori: Kategori) =>
  kategori.urlparam === valgtKategori.urlparam;

export const typeTilEngelsk = (type: string) =>
  type === "engelsk" ? "english" : type;

export const typeTilNorsk = (type: string) =>
  type === "english" ? "engelsk" : type;

export const typeTilLocale = (type: string) =>
  type === "engelsk" ? "en" : "nb";

export const filtrerKategorier = (kategorier: Kategori[], type: string) =>
  kategorier.filter(kategori => kategori.domene.toLowerCase() === type);
