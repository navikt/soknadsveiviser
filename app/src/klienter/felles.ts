import { loggApiError } from "../utils/logger";
import { parseJson } from "./parser";

export const hentJson = (url: string) =>
  new Promise((resolve, reject) =>
    fetch(url)
      .then(response => sjekkForFeil(url, response, reject))
      .then(parseJson)
      .then(resolve)
      .catch(reject)
  );

export const sjekkForFeil = (
  url: string,
  response: Response,
  reject: (reason?: any) => void
) =>
  response.ok
    ? response
    : (loggApiError(url, response),
      reject({
        code: response.status,
        text: response.statusText
      }));
