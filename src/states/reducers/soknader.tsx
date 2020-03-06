import { Soknader } from "../../typer/soknad";
import { ReduxDataError, ReduxHttpError } from "./felles";
import { HTTPError } from "../../typer/errors";
import { Store, FetchSoknader } from "../../typer/store";

interface SoknaderResult {
  type: string;
  soknader: Soknader;
}

// Actions
export const settSoknaderRequest = () => {
  return { type: "SETT_SOKNADER_REQUEST" };
};

export const settSoknaderResult = (soknader: Soknader) =>
  !soknader.soknadslenker.length && !soknader.soknadsobjekter.length && !soknader.skjemalenker.length
    ? settSoknaderDataError("errors.api.soknader")
    : { type: "SETT_SOKNADER_RESULT", soknader };

export const settSoknaderDataError = (error: string) => {
  return { type: "SETT_SOKNADER_DATA_ERROR", error };
};

export const settSoknaderHttpError = (error: HTTPError) => {
  return { type: "SETT_SOKNADER_HTTP_ERROR", error };
};

// Reducers
type SoknaderActions = SoknaderResult & ReduxDataError & ReduxHttpError;
export const soknader = (
  state: FetchSoknader,
  action: SoknaderActions,
  root: Store
) => {
  switch (action.type) {
    case "SETT_SOKNADER_REQUEST":
      return { ...state, status: "LOADING" };
    case "SETT_SOKNADER_RESULT":
      return { ...state, status: "RESULT", ...action.soknader };
    case "SETT_SOKNADER_DATA_ERROR":
      return { ...state, status: "DATA_ERROR", error: action.error };
    case "SETT_SOKNADER_HTTP_ERROR":
      return { ...state, status: "HTTP_ERROR", error: action.error };
    default:
      return state;
  }
};
