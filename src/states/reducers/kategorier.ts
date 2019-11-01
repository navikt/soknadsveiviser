import { Kategori } from "../../typer/kategori";
import { Underkategori } from "../../typer/underkategori";
import { Store, FetchKategorier } from "../../typer/store";
import { typeTilNorsk } from "../../utils/kategorier";
import { filtrerKategorier } from "../../utils/kategorier";
import { HTTPError } from "../../typer/errors";
import { ReduxDataError, ReduxHttpError } from "./felles";
import { loggError } from "../../utils/logger";

// Interfaces
interface SettValgtType {
  type: string;
  kategoriType: string;
}

interface SettValgtKategori {
  type: string;
  kategori: Kategori;
}

interface SettValgtUnderkategori {
  type: string;
  underkategori: Underkategori;
}

interface SettKategorier {
  type: string;
  kategorier: Kategori[];
}

// Actions
export const settKategorierRequest = () => {
  return { type: "SETT_KATEGORIER_REQUEST" };
};

export const settKategorierResult = (kategorier: Kategori[]) => {
  return { type: "SETT_KATEGORIER_RESULT", kategorier };
};

export const settKategorierDataError = (error: string) => {
  return { type: "SETT_KATEGORIER_DATA_ERROR", error };
};

export const settKategorierHttpError = (error: HTTPError) => {
  return { type: "SETT_KATEGORIER_HTTP_ERROR", error };
};

export const settValgtType = (kategoriType: string) => {
  return { type: "SETT_VALGT_TYPE", kategoriType };
};

export const settValgtKategori = (kategori: Kategori) => {
  return { type: "SETT_VALGT_KATEGORI", kategori };
};

export const settValgtUnderkategori = (underkategori: Underkategori) => {
  return { type: "SETT_VALGT_UNDERKATEGORI", underkategori };
};

// Reducers
type KategoriActions = SettValgtType &
  SettValgtKategori &
  SettKategorier &
  SettValgtUnderkategori &
  ReduxDataError &
  ReduxHttpError;

export const kategorier = (
  state: FetchKategorier,
  action: KategoriActions,
  root: Store
) => {
  switch (action.type) {
    case "SETT_KATEGORIER_REQUEST":
      return { ...state, status: "LOADING" };
    case "SETT_KATEGORIER_RESULT":
      const { pathname } = window.location;
      const urlSplices = pathname.split("/");
      let index =
        urlSplices[3] === "klage" || urlSplices[3] === "ettersendelse" ? 4 : 3;

      const urlType = urlSplices[index] || "person";
      const urlKategori = urlSplices[index + 1];
      const urlUnderkategori = urlSplices[index + 2];
      const valgtType = typeTilNorsk(urlType);

      const sorterteKategorier = action.kategorier.sort(
        (a, b) => (b.prioritet || 0) - (a.prioritet || 0)
      );
      const aktiveKategorier = filtrerKategorier(sorterteKategorier, valgtType);

      let valgtKategori = aktiveKategorier
        .filter(kategori => urlKategori === kategori.urlparam)
        .shift();

      if (!urlKategori && !valgtKategori) {
        valgtKategori = aktiveKategorier[0];
      }

      const valgtUnderkategori =
        valgtKategori &&
        valgtKategori.underkategorier
          .filter(kategori => urlUnderkategori === kategori.urlparam)
          .shift();

      if (!valgtKategori) {
        loggError(`Finner ikke valgt kategori ${urlKategori}, som ble lenket til fra ${document.referrer}`);
        return {
          status: "DATA_ERROR",
          error: "errors.api.kategori"
        };
      }

      if (urlUnderkategori && !valgtUnderkategori) {
        loggError(`Finner ikke valgt underkategori ${urlUnderkategori}, som ble lenket til fra ${document.referrer}`);
        return {
          status: "DATA_ERROR",
          error: "errors.api.underkategori"
        };
      }

      return {
        ...state,
        status: "RESULT",
        valgtType: valgtType,
        valgtKategori: valgtKategori,
        valgtUnderkategori: valgtUnderkategori,
        alleKategorier: sorterteKategorier
      };

    case "SETT_KATEGORIER_DATA_ERROR":
      return { ...state, status: "DATA_ERROR", error: action.error };
    case "SETT_KATEGORIER_HTTP_ERROR":
      return { ...state, status: "HTTP_ERROR", error: action.error };
    case "SETT_VALGT_TYPE":
      if (state.status === "RESULT") {
        const { alleKategorier } = state;
        const forsteKategori = filtrerKategorier(
          alleKategorier,
          action.kategoriType
        ).shift();

        return state.valgtType !== action.kategoriType
          ? {
              ...state,
              valgtType: action.kategoriType,
              valgtKategori: forsteKategori
            }
          : state;
      } else {
        return state;
      }
    case "SETT_VALGT_KATEGORI":
      return {
        ...state,
        valgtKategori: action.kategori
      };
    case "SETT_VALGT_UNDERKATEGORI":
      return {
        ...state,
        valgtUnderkategori: action.underkategori
      };

    default:
      return state;
  }
};
