import { PersonaliaKontekst } from "../../../../../states/providers/Personalia";
import { hentVedleggslisteForJoark, hentDokumentliste } from "./lister";
import { Vedleggsobjekt } from "../../../../../typer/vedlegg";
import { adresseOgBrukerInfo } from "./json/brukerInfo";
import { Soknadsobjekt } from "../../../../../typer/soknad";
import { velgGyldigLocale } from "./locale";
import { parseJson } from "../../../../../klienter/parser";
import { sjekkForFeil } from "../../../../../klienter/felles";
import { localeTekst } from "../../../../../utils/sprak";

export interface Params {
  personalia: PersonaliaKontekst;
  relevanteVedlegg: Vedleggsobjekt[];
  valgtSoknadsobjekt: Soknadsobjekt;
  klageSoknadsobjekt: Soknadsobjekt;
  globalLocale: string;
  valgtLocale: string;
  ettersendelse?: string;
  klage?: boolean;
}

export const hentForsteside = (params: Params): Promise<string> =>
  new Promise(async (resolve, reject) => {
    const url = "/soknadsveiviser/api/forsteside";
    const { klage, klageSoknadsobjekt, valgtSoknadsobjekt } = params;
    const soknadsobjekt = klage ? klageSoknadsobjekt : valgtSoknadsobjekt;
    const { navn, hovedskjema, innsendingsmate } = soknadsobjekt;
    const locale = velgGyldigLocale(params.valgtLocale, params.globalLocale);
    const vedleggSomSkalSendes = params.relevanteVedlegg
      .filter(vedlegg => !vedlegg.skalEttersendes)
      .map(vedlegg => vedlegg.vedlegg);

    const json = {
      foerstesidetype: params.ettersendelse ? "ETTERSENDELSE" : "SKJEMA",
      navSkjemaId: hovedskjema.skjemanummer,
      spraakkode: locale.toUpperCase(),
      overskriftstittel: `${localeTekst(navn, locale)} ${
        hovedskjema.skjemanummer
      }`,
      tema: params.valgtSoknadsobjekt.tema.temakode,
      vedleggsliste: hentVedleggslisteForJoark(vedleggSomSkalSendes, locale),
      dokumentlisteFoersteside: hentDokumentliste(
        vedleggSomSkalSendes,
        hovedskjema,
        params.valgtLocale,
        params.ettersendelse
      ),
      ...adresseOgBrukerInfo(innsendingsmate, params.personalia)
    };

    console.group("Innsending førsteside-generator");
    console.log(json);
    console.groupEnd();

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json)
    })
      .then(response => sjekkForFeil(url, response, reject))
      .then(parseJson)
      .then(response => response.foersteside)
      .then(resolve)
      .catch(reject);
  });
