import { PersonaliaKontekst } from "../../../../../states/providers/Personalia";
import { apiKallSoknadsobjektForKlage } from "../../../../../klienter/sanityKlient";
import { hentVedleggslisteForJoark, hentDokumentliste } from "./lister";
import { Vedleggsobjekt } from "../../../../../typer/vedlegg";
import { adresseOgBrukerInfo } from "./json/brukerInfo";
import { Soknadsobjekt } from "../../../../../typer/soknad";
import { velgGyldigLocale } from "./locale";
import { parseJson } from "../../../../../klienter/parser";
import { sjekkForFeil } from "../../../../../klienter/felles";
import { localeTekst } from "../../../../../utils/sprak";

export const hentForsteside = (
  relevanteVedlegg: Vedleggsobjekt[],
  personaliaKontekst: PersonaliaKontekst,
  valgtLocale: string,
  globalLocale: string,
  valgtSoknadsobjekt: Soknadsobjekt,
  ettersendelse?: string,
  klage?: string
): Promise<string> =>
  new Promise(async (resolve, reject) => {
    const url = "/soknadsveiviser/api/forsteside";
    const soknadsobjekt = klage
      ? await apiKallSoknadsobjektForKlage()
      : valgtSoknadsobjekt;

    const { navn, hovedskjema, innsendingsmate } = soknadsobjekt;
    const locale = velgGyldigLocale(valgtLocale, globalLocale);
    const vedleggSomSkalSendes = relevanteVedlegg
      .filter(vedlegg => !vedlegg.skalEttersendes)
      .map(vedlegg => vedlegg.vedlegg);

    const json = {
      foerstesidetype: ettersendelse ? "ETTERSENDELSE" : "SKJEMA",
      navSkjemaId: hovedskjema.skjemanummer,
      spraakkode: locale.toUpperCase(),
      overskriftstittel: `${localeTekst(navn, locale)} ${
        hovedskjema.skjemanummer
      }`,
      tema: valgtSoknadsobjekt.tema.temakode,
      vedleggsliste: hentVedleggslisteForJoark(vedleggSomSkalSendes, locale),
      dokumentlisteFoersteside: hentDokumentliste(
        vedleggSomSkalSendes,
        hovedskjema,
        valgtLocale,
        ettersendelse
      ),
      ...adresseOgBrukerInfo(innsendingsmate, personaliaKontekst)
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
