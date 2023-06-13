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

const getSkjemaoversiktUrl = (type: SkjemaoversiktType) =>
  window.location.host.endsWith("dev.nav.no") ? skjemaoversikterDev[type] : skjemaoversikterProd[type];

export const getApplicableSkjemaoversiktRedirect = (matchParams?: AllRoutes) => {
  if (!matchParams) {
    return getSkjemaoversiktUrl("personSkjema");
  }

  const { personEllerBedrift, inngang, skjemanummer } = matchParams;

  if (personEllerBedrift === "bedrift") {
    return getSkjemaoversiktUrl("arbeidsgiver");
  }

  const skjemaType = skjemanummer && decodeURI(window.location.pathname).split(skjemanummer)[1]?.split("/")[1];

  if (inngang === "klage" || skjemaType === "anke" || skjemaType === "klage" || skjemaType === "klage-eller-anke") {
    return getSkjemaoversiktUrl("personKlage");
  }

  if (inngang === "ettersendelse" || skjemaType === "ettersendelse") {
    return getSkjemaoversiktUrl("personEttersendelse");
  }

  return getSkjemaoversiktUrl("personSkjema");
};
