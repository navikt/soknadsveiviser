import {HttpException} from "./HttpException";
const windowWithLogger = window as any;

const mask = (error: string) =>
  error.replace(/(^|\W)\d{11}(?=$|\W)/, "1**********");

export const loggEvent = (
  tittel: string,
  fields?: { [key: string]: any },
  tags?: { [key: string]: any }
) =>
  windowWithLogger['frontendlogger'] &&
  windowWithLogger['frontendlogger'].event(mask(tittel), fields || {}, tags || {});

export const loggError = (error: string) =>
  windowWithLogger['frontendlogger'] && windowWithLogger['frontendlogger'].error(mask(error));

export const loggApiError = (url: string, error: string, status?: number) => {
  const errorMessage = `Feil ved henting av data: ${url} - ${error}`;

  const title = "soknadsveiviser.apiclient.error";
  const tags = {};
  const fields = {
    status: status || 404,
    statusText: mask(error),
    url: mask(url)
  };

  loggError(errorMessage);
  loggEvent(title, fields, tags);
};

export function loggApiException(url: string, err: Error) {
  if (err instanceof HttpException) {
    loggResponseAndApiError(url, err.response);
    return;
  }
  const errorMessage = `Feil ved henting av data: ${url} - ${err.message}`;
  loggError(errorMessage);
  const title = "soknadsveiviser.apiclient.error";
  const fields = {
    errorMessage: errorMessage,
    url: mask(url)
  };
  loggEvent(title, fields, {})
}

export const loggResponseAndApiError = (url: string, response: Response) => {
  loggApiError(
    url,
    `${response.status} ${response.statusText}`,
    response.status
  );
};
