import { Enhet } from "../typer/enhet";
import { Config } from "../config";
import { parseJson } from "./parser";

export const fetchConfig = (): Promise<Config> =>
  fetch("/soknader/config")
    .then(parseJson)
    .catch(console.error);

export const fetchEnheter: () => Promise<Enhet[]> = () =>
  fetch("/soknader/api/enheter")
    .then(parseJson)
    .catch(console.error);
