import { loggApiError } from "../utils/logger";
import { parseJson } from "./parser";

export const hentJson = (url: string) =>
  fetch(url)
    .then(response => sjekkForFeil(url, response))
    .then(parseJson)
    .catch(response => loggApiError(url, response));

export const sjekkForFeil = (
  url: string,
  response: Response,
) =>
  response.ok
    ? response
    : loggApiError(url, response);
