import { Enhet } from "../typer/enhet";
import { Config } from "../config";
import { parseJson } from "./parser";

export const fetchConfig = (): Promise<Config> =>
  fetch("/soknader/config")
    .then((res) => Object.isExtensible(res) ? res.json() : res.clone().json())
    .catch(console.error);

export const fetchEnheter: () => Promise<Enhet[]> = () =>
  fetch("/soknader/api/enheter")
    .then(parseJson)
    .catch(console.error);
