export interface Config {
  proxyUrl: string;
  tjenesteUrl: string;
  sanityDataset: string;
}

let config: Config;

export const setConfig = (data: Config): void => {
  config = data;
};

export const getProxyUrl = (): string => config.proxyUrl;
export const getSanityDataset = (): string => config.sanityDataset;

export const getTjenesteUrl = (): string => {
  if (window.location.href.indexOf("soknadsveiviser-q0") !== -1) {
    return "https://tjenester-q0.nav.no";
  } else if (window.location.href.indexOf("soknadsveiviser-q1") !== -1) {
    return "https://tjenester-q1.nav.no";
  } else {
    return "https://tjenester.nav.no";
  }
};

function spraakToNavNoUrl(language: string) {
  switch (language) {
    case 'SAMISK':
      return 'https://www.nav.no/se/samegiella';
    case 'ENGELSK':
      return 'https://www.nav.no/en/home';
  }
  return 'https://www.nav.no/no/person';
}

export function cookieStringToDictionary(cookie: string) {
  const cookies = cookie.split(';');
  const keyValue: { [key: string]: string } = {};
  cookies.forEach((cookieString) => {
    const [key, value] = cookieString.trim().split('=');
    keyValue[key] = value;
  });
  return keyValue;
}

export const decoratorContextFromCookie = (cookie: string) => {
  const keyValue = cookieStringToDictionary(cookie);
  const language = keyValue['decorator-language'];
  if (language && language !== 'NORSK') {
    return {context: 'PRIVATPERSON', nav_no_url: spraakToNavNoUrl(language)}
  }
  switch (keyValue['decorator-context']) {
    case 'ARBEIDSGIVER':
      return {context: 'ARBEIDSGIVER', nav_no_url: 'https://www.nav.no/no/bedrift'}
    case 'SAMARBEIDSPARTNER':
      return {context: 'SAMARBEIDSPARTNER', nav_no_url: 'https://www.nav.no/no/samarbeidspartner'}
  }
  return {context: 'PRIVATPERSON', nav_no_url: 'https://www.nav.no/no/person'}
}

export const getConfig = (): Config => config;

export const getDefault = (): Config => ({
  proxyUrl: "/soknader/api/sanity",
  tjenesteUrl: "https://tjenester-q0.nav.no",
  sanityDataset: "local-testset"
});
