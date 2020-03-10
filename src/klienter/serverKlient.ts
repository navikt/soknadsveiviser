import { Enhet } from "../typer/enhet";
import { Config } from "../config";
import { parseJson } from "./parser";

export const fetchConfig = (): Promise<Config> =>
  fetch("/soknader/config")
    // Denne sjekken er for proxy-polyfill for IE11 støtte, usikker på det er nødvendig i prod
    .then((res) => Object.isExtensible(res) ? res.json() : res.clone().json())
    .catch(console.error);

export const fetchEnheter: () => Promise<Enhet[]> = () =>
  fetch("/soknader/api/enheter")
    .then(parseJson)
    .catch(console.error);
