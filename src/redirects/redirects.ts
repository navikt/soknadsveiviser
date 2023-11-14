import { AllRoutes } from "./NySkjemaoversiktRedirects";

type SkjemaoversiktType = keyof typeof skjemaoversikterProd;

const skjemaoversikterProd = {
  personSkjema: "https://www.nav.no/soknader",
  personKlage: "https://www.nav.no/klage",
  personEttersendelse: "https://www.nav.no/ettersende",
  arbeidsgiver: "https://www.nav.no/arbeidsgiver/soknader",
};

const skjemaoversikterDev: typeof skjemaoversikterProd = {
  personSkjema: "https://www.ekstern.dev.nav.no/soknader",
  personKlage: "https://www.ekstern.dev.nav.no/klage",
  personEttersendelse: "https://www.ekstern.dev.nav.no/ettersende",
  arbeidsgiver: "https://www.ekstern.dev.nav.no/arbeidsgiver/soknader",
};

const urlsForSprak = (sprak?: string) => {
  const urls = window.location.host.endsWith("dev.nav.no") ? skjemaoversikterDev : skjemaoversikterProd;

  return (type: SkjemaoversiktType) => {
    const baseUrl = urls[type];
    return sprak === "en" ? `${baseUrl}/en` : baseUrl;
  };
};

export const getApplicableSkjemaoversiktRedirect = (matchParams?: AllRoutes) => {
  const getUrlForType = urlsForSprak(matchParams?.sprak);

  if (!matchParams) {
    return getUrlForType("personSkjema");
  }

  const { personEllerBedrift, inngang, skjemanummer } = matchParams;

  if (personEllerBedrift === "bedrift") {
    return getUrlForType("arbeidsgiver");
  }

  const skjemaType = skjemanummer && decodeURI(window.location.pathname).split(skjemanummer)[1]?.split("/")[1];

  if (inngang === "klage" || skjemaType === "anke" || skjemaType === "klage" || skjemaType === "klage-eller-anke") {
    return getUrlForType("personKlage");
  }

  if (inngang === "ettersendelse" || skjemaType === "ettersendelse") {
    return getUrlForType("personEttersendelse");
  }

  return getUrlForType("personSkjema");
};
