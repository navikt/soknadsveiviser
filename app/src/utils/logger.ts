const { frontendlogger } = window as any;

export const loggEvent = (
  tittel: string,
  fields?: { [key: string]: any },
  tags?: { [key: string]: any }
) => frontendlogger && frontendlogger.event(tittel, fields || {}, tags || {});

export const loggError = (error: string) =>
  frontendlogger && frontendlogger.error(error);

export const loggApiError = (url: string, response: Response) => {
  const error =
    `Feil ved henting av data: ` +
    `${url} - ${response.status} ${response.statusText}`;

  const title = "soknadsveiviser.apiclient.error";
  const tags = {};
  const fields = {
    status: response.status,
    statusText: response.statusText,
    url
  };

  loggError(error);
  loggEvent(title, fields, tags);
};
