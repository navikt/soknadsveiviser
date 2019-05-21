import { Underkategori } from "./underkategori";
import { LocaleString } from "./sprak";

export interface Kategori {
  _id: string;
  underkategorier: Underkategori[];
  tittel: LocaleString;
  domenefarge: string;
  kantfarge: string;
  urlparam: string;
  domene: string;
  prioritet: number;
}
