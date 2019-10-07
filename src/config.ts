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

export const getSkjemaveilederUrlPerson = (locale: string): string =>
    (window.location.hostname.indexOf("www-q0") > -1) ?
        getSkjemaveilederUrlPersonQ0(locale) : getSkjemaveilederUrlPersonProd(locale);

export const getSkjemaveilederUrlBedrift = (): string =>
    (window.location.hostname.indexOf("www-q0") > -1) ?
        "https://www-q0.nav.no/no/Bedrift/Skjemaer-for-arbeidsgivere?exclude-from-footer-a-aa=true&fraNy=true"
        : "https://www.nav.no/no/Bedrift/Skjemaer-for-arbeidsgivere?exclude-from-footer-a-aa=true&fraNy=true";

const getSkjemaveilederUrlPersonQ0 = (locale: string): string =>
    locale === "en" ?
        "https://www-q0.nav.no/en/Home/Forms+for+individuals/Forms"
        : "https://www-q0.nav.no/no/Person/Skjemaer-for-privatpersoner?fraNy=true";

const getSkjemaveilederUrlPersonProd = (locale: string): string =>
    locale === "en" ?
        "https://www.nav.no/en/Home/Forms+for+individuals/Forms"
        : "https://www.nav.no/no/Person/Skjemaer-for-privatpersoner?fraNy=true";
