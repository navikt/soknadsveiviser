import { Enhet } from "../typer/enhet";
import { Config } from "../config";
import { parseJson } from "./parser";
import { Enhetstype } from "../typer/soknad";

export const fetchConfig = (): Promise<Config> =>
  fetch("/soknader/config")
    // Denne sjekken er for proxy-polyfill for IE11 støtte, usikker på det er nødvendig i prod
    .then(res => (Object.isExtensible(res) ? res.json() : res.clone().json()))
    .catch(console.error);

export const fetchEnheter = (enhetstyper?: Enhetstype[]): Promise<Enhet[]> => {
  const queryParams =
    enhetstyper && enhetstyper.length > 0
      ? `?enhetstyper=${enhetstyper.map(enhetstyper => enhetstyper.name).join(",")}`
      : "";
  return fetch(`/soknader/api/enheter${queryParams}`)
    .then(parseJson)
    .catch(console.error);
};
