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
export const getTjenesteUrl = (): string => config.tjenesteUrl;
export const getSanityDataset = (): string => config.sanityDataset;

export const getConfig = (): Config => config;
export const getDefault = (): Config => ({
  proxyUrl: "http://localhost:8080/soknadsveiviserproxy",
  tjenesteUrl: "https://tjenester-q0.nav.no",
  sanityDataset: "local-testset"
});
