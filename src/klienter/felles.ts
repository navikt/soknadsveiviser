import {parseJson} from "./parser";
import {HttpException} from "../utils/HttpException";
import {loggApiException} from "../utils/logger";

export const hentJson = (url: string) =>
  fetch(url)
    .then(response => sjekkForFeil(url, response))
    .then(parseJson)
    .catch(error => loggApiException(url, error));

export const sjekkForFeil = (url: string,  response: Response) => {
  if (!response.ok) {
    throw new HttpException(response);
  }
  return response;
};