import { Kategori } from "../typer/kategori";
import { Soknadsobjekt, Soknader } from "../typer/soknad";
import { filtrerSoknadsojekt } from "../utils/soknadsobjekter";
import { getProxyUrl } from "../config";
import { hentJson } from "./felles";
import { HTTPError } from "../typer/errors";
import { Dispatch } from "redux";
import {
  settVedlegg,
  settAlleVedleggSkalSendesForSoknadsobjekt
} from "../states/reducers/vedlegg";
import {
  settKategorierRequest,
  settKategorierResult,
  settKategorierHttpError
} from "../states/reducers/kategorier";
import {
  settSoknaderRequest,
  settSoknaderResult,
  settSoknaderHttpError
} from "../states/reducers/soknader";
import {
  settSoknadsobjektRequest,
  settValgtSoknadsobjekt,
  settKlageSoknadsobjekt,
  settSoknadsobjektHttpError
} from "../states/reducers/valgtSoknad";
import { Skjema } from "../typer/skjemaogvedlegg";

// API kall
export const apiKallSamlet = (): Promise<Skjema[]> =>
  hentJson(`${getProxyUrl()}/samlet`) as Promise<Skjema[]>;

export const apiKallAlleSkjemaer = (): Promise<Skjema[]> =>
  hentJson(`${getProxyUrl()}/alleskjemaer`) as Promise<Skjema[]>;

export const apiKallAlleSEDSkjemaer = (): Promise<Skjema[]> =>
  hentJson(`${getProxyUrl()}/sedskjemaer`) as Promise<Skjema[]>;

export const apiKallAlleKategorier = () =>
  hentJson(`${getProxyUrl()}/allekategorier`) as Promise<Kategori[]>;

export const apiKallSoknader = (kategori: String, underkategori: string) =>
  hentJson(
    `${getProxyUrl()}/soknadsobjekter-og-soknadslenker?kategori=${kategori}&underkategori=${underkategori}`
  ) as Promise<Soknader>;

export const apiKallSoknadsobjektForKlage = () =>
  hentJson(`${getProxyUrl()}/soknadsobjekt/klage-og-anke`) as Promise<
    Soknadsobjekt
  >;

// Benytt api kall og oppdater store
export const apiHentAlleKategorier = () => (dispatch: Dispatch) => {
  dispatch(settKategorierRequest());
  apiKallAlleKategorier()
    .then((result: Kategori[]) => dispatch(settKategorierResult(result)))
    .catch((error: HTTPError) => dispatch(settKategorierHttpError(error)));
};

export const apiHentSoknader = (kategori: String, underkategori: string) => (
  dispatch: Dispatch
) => {
  dispatch(settSoknaderRequest());
  apiKallSoknader(kategori, underkategori)
    .then((result: Soknader) => dispatch(settSoknaderResult(result)))
    .catch((error: HTTPError) => dispatch(settSoknaderHttpError(error)));
};

export const apiHentSoknadsobjekt = (
  kategori: String,
  underkategori: string,
  skjemanummer: string
) => (dispatch: Dispatch) => {
  dispatch(settSoknadsobjektRequest());
  apiKallSoknader(kategori, underkategori)
    .then((soknader: Soknader) => filtrerSoknadsojekt(soknader, skjemanummer))
    .then(soknadsobjekt => {
      dispatch(settValgtSoknadsobjekt(soknadsobjekt));
      dispatch(settVedlegg(soknadsobjekt));
    })
    .catch((error: HTTPError) => dispatch(settSoknadsobjektHttpError(error)));
};

export const apiHentSoknadsobjektForKlage = (skalEttersende: boolean) => (
  dispatch: Dispatch
) => {
  dispatch(settSoknadsobjektRequest());
  apiKallSoknadsobjektForKlage()
    .then((klageSoknadsobjekt: Soknadsobjekt) => {
      dispatch(settKlageSoknadsobjekt(klageSoknadsobjekt));
      dispatch(settVedlegg(klageSoknadsobjekt));
      if (skalEttersende) {
        dispatch(settAlleVedleggSkalSendesForSoknadsobjekt(klageSoknadsobjekt));
      }
    })
    .catch((error: HTTPError) => dispatch(settSoknadsobjektHttpError(error)));
};
