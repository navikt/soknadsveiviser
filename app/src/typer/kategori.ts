import { Underkategori } from "./underkategori";
import { SprakString } from "./sprak";

export interface Kategori {
  _id: string;
  underkategorier: Underkategori[];
  tittel: SprakString;
  domenefarge: string;
  kantfarge: string;
  urlparam: string;
  domene: string;
  prioritet: number;
}
