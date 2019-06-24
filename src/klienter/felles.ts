import { loggApiError, loggResponseAndApiError} from "../utils/logger";
import { parseJson } from "./parser";

export const hentJson = (url: string) =>
  fetch(url)
    .then(response => sjekkForFeil(url, response))
    .then(parseJson)
    .catch(error => loggApiError(url, error));

export const sjekkForFeil = (
  url: string,
  response: Response,
) =>
  response.ok
    ? response
    : loggResponseAndApiError(url, response);
