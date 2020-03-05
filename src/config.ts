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
  if (window.location.href.indexOf("www-q0") !== -1) {
    return "https://tjenester-q0.nav.no";
  } else if (window.location.href.indexOf("www-q1") !== -1) {
    return "https://tjenester-q1.nav.no";
  } else {
    return "https://tjenester.nav.no";
  }
};

export const getConfig = (): Config => config;
export const getDefault = (): Config => ({
  proxyUrl: "http://localhost:8080/soknadsveiviserproxy",
  tjenesteUrl: "https://tjenester-q0.nav.no",
  sanityDataset: "local-testset"
});
