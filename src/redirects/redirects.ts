import { AllRoutes } from "./NySkjemaoversiktRedirects";

type SkjemaoversiktType = keyof typeof skjemaoversikterProd;

const skjemaoversikterProd = {
  personSkjema: "https://www.nav.no/skjemaoversikt-test/privatperson",
  personKlage: "https://www.nav.no/skjemaoversikt-test/privatperson-klage",
  personEttersendelse: "https://www.nav.no/skjemaoversikt-test/privatperson-ettersendelse",
  arbeidsgiver: "https://www.nav.no/skjemaoversikt-test/arbeidsgiver",
  samarbeidspartner: "https://www.nav.no/skjemaoversikt-test/samarbeidspartner",
};

const skjemaoversikterDev: typeof skjemaoversikterProd = {
  personSkjema: "https://www.nav.no/skjemaoversikt-test/privatperson",
  personKlage: "https://www.nav.no/skjemaoversikt-test/privatperson-klage",
  personEttersendelse: "https://www.nav.no/skjemaoversikt-test/privatperson-ettersendelse",
  arbeidsgiver: "https://www.nav.no/skjemaoversikt-test/arbeidsgiver",
  samarbeidspartner: "https://www.nav.no/skjemaoversikt-test/samarbeidspartner",
};

const getSkjemaoversiktUrl = (type: SkjemaoversiktType) =>
  window.location.host.endsWith("dev.nav.no") ? skjemaoversikterDev[type] : skjemaoversikterProd[type];

export const getApplicableSkjemaoversiktRedirect = (matchParams?: AllRoutes) => {
  if (!matchParams) {
    return getSkjemaoversiktUrl("personSkjema");
  }

  const { personEllerBedrift, inngang } = matchParams;

  if (personEllerBedrift === "bedrift") {
    return getSkjemaoversiktUrl("arbeidsgiver");
  }

  if (inngang === "klage") {
    return getSkjemaoversiktUrl("personKlage");
  }

  if (inngang === "ettersendelse") {
    return getSkjemaoversiktUrl("personEttersendelse");
  }

  return getSkjemaoversiktUrl("personSkjema");
};
