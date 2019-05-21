import { Soknadsobjekt } from "../../typer/soknad";
import { Store, FetchSoknad } from "../../typer/store";
import { HTTPError } from "../../typer/errors";
import { ReduxDataError, ReduxHttpError } from "./felles";

// Interfaces
interface SettSoknadsobjekt {
  type: string;
  soknadsobjekt: Soknadsobjekt;
  klage?: boolean;
}

// Actions
export const settSoknadsobjektRequest = () => ({
  type: "SETT_SOKNADSOBJEKT_REQUEST"
});

export const settValgtSoknadsobjekt = (soknadsobjekt?: Soknadsobjekt) =>
  !soknadsobjekt
    ? settSoknadsobjektDataError("errors.api.soknadsobjekt")
    : {
        type: "SETT_SOKNADSOBJEKT_RESULT",
        soknadsobjekt
      };

export const settKlageSoknadsobjekt = (soknadsobjekt: Soknadsobjekt) => ({
  type: "SETT_SOKNADSOBJEKT_RESULT",
  soknadsobjekt,
  klage: true
});

export const settSoknadsobjektDataError = (error: string) => ({
  type: "SETT_SOKNADSOBJEKT_DATA_ERROR",
  error
});

export const settSoknadsobjektHttpError = (error: HTTPError) => ({
  type: "SETT_SOKNADSOBJEKT_HTTP_ERROR",
  error
});

// Reducers
type Action = SettSoknadsobjekt & ReduxDataError & ReduxHttpError;
export const valgtSoknad = (
  state: FetchSoknad,
  action: Action,
  root: Store
) => {
  switch (action.type) {
    case "SETT_SOKNADSOBJEKT_REQUEST":
      return { ...state, status: "LOADING" };
    case "SETT_SOKNADSOBJEKT_RESULT":
      const { soknadsobjekt, klage } = action;
      return {
        ...state,
        status: "RESULT",
        ...(klage
          ? {
              klageSoknadsobjekt: soknadsobjekt
            }
          : {
              valgtSoknadsobjekt: soknadsobjekt
            })
      };
    case "SETT_SOKNADSOBJEKT_DATA_ERROR":
      return { ...state, status: "DATA_ERROR", error: action.error };
    case "SETT_SOKNADSOBJEKT_HTTP_ERROR":
      return { ...state, status: "HTTP_ERROR", error: action.error };
    default:
      return state;
  }
};
