import { HTTPError } from "../../typer/errors";

export interface ReduxHttpError {
  type: string;
  error: HTTPError;
}

export interface ReduxDataError {
  type: string;
  error: string;
}
