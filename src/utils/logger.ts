import {HttpException} from "./HttpException";

const mask = (error: string) =>
  error.replace(/(^|\W)\d{11}(?=$|\W)/, "1**********");

export const loggEvent = (
  tittel: string,
  fields: { [key: string]: any } = {},
  tags: { [key: string]: any } = {},
) => {
  return fetch("/soknader/api/logger/info", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: mask(tittel),
      fields,
      tags,
    })
  }).catch((err) => console.log(err));
}

export const loggError = (error: string) => {
  return fetch("/soknader/api/logger/error", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({message: mask(error)})
  }).catch((err) => console.log(err));
}

export const loggApiError = async (url: string, error: string, status?: number) => {
  const errorMessage = `Feil ved henting av data: ${url} - ${error}`;

  const title = "soknadsveiviser.apiclient.error";
  const tags = {};
  const fields = {
    status: status || 404,
    statusText: mask(error),
    url: mask(url)
  };

  return Promise.all([
    loggError(errorMessage),
    loggEvent(title, fields, tags)
  ])
};

export async function loggApiException(url: string, err: Error) {
  if (err instanceof HttpException) {
    await loggResponseAndApiError(url, err.response);
    return;
  }
  const errorMessage = `Feil ved henting av data: ${url} - ${err.message}`;
  await loggError(errorMessage);
  const title = "soknadsveiviser.apiclient.error";
  const fields = {
    errorMessage: errorMessage,
    url: mask(url)
  };
  await loggEvent(title, fields, {})
}

export const loggResponseAndApiError = async (url: string, response: Response) => {
  await loggApiError(
    url,
    `${response.status} ${response.statusText}`,
    response.status
  );
};
