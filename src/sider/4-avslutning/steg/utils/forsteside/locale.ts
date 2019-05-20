export const velgGyldigLocale = (valgtLocale: string, globalLocale: string) =>
  ["nb", "nn", "en"].includes(valgtLocale) ? valgtLocale : globalLocale;
