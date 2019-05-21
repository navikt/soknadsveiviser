import { HTTPError } from "./errors";

export interface Loading {
  status: "LOADING";
}

export interface Result {
  status: "RESULT";
}

export interface DataError {
  status: "DATA_ERROR";
  error: string;
}

export interface HttpError {
  status: "HTTP_ERROR";
  error: HTTPError;
}
