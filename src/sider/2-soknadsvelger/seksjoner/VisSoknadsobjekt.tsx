import * as React from "react";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import { injectIntl, InjectedIntlProps } from "react-intl";
import BlockContent from "@sanity/block-content-to-react";
import KnappSoknadsdialog from "../knapper/Soknadsdialog";
import KnappDokumentinnsending from "../knapper/Dokumentinnsending";
import KnappPapirSoknad from "../knapper/PapirSoknad";
import KnappEttersendelse from "../knapper/Ettersendelse";
import KnappKlage from "../knapper/Klage";
import KnappFyllUt from "../knapper/FyllUt";
import KnappFyllUtPapir from "../knapper/FyllUtPapir";
import RelevantInformasjon from "./RelevantInformasjon";
import { link } from "utils/serializers";
import { finnesInngangTilSoknadsdialog, finnesDokumentinnsending, finnesFyllUtUrl } from "utils/soknadsobjekter";
import { Soknadsobjekt } from "typer/soknad";
import LocaleTekst from "komponenter/localetekst/LocaleTekst";
import { localeBlockTekst } from "utils/sprak";
import { RouteComponentProps, withRouter } from "react-router";
import { hentSkjemanummerHash } from "utils/hentSkjemanummerHash";
import { convertNAVSkjemanummerTilHash } from "utils/hentSkjemanummerHash";
import LocaleBlockTextAlertStripeAdvarsel from "../../../komponenter/felles/LocaleBlockTextAlertStripeAdvarsel";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";

interface SoknadsinngangerProps {
  soknadsobjekt: Soknadsobjekt;
  locale: string;
}

export const Soknadsinnganger = (props: SoknadsinngangerProps) => {
  const { locale, soknadsobjekt } = props;
  const tilsoknadsdialog = finnesInngangTilSoknadsdialog(soknadsobjekt, locale);
  const dokumentinnsending = finnesDokumentinnsending(soknadsobjekt);
  const fyllUt = finnesFyllUtUrl(soknadsobjekt, locale);
  return (
    <div className="knapper-wrapper litenavstand">
      {tilsoknadsdialog && fyllUt && (
        <>
          <KnappSoknadsdialog soknadsobjekt={soknadsobjekt} />
          <KnappFyllUtPapir soknadsobjekt={soknadsobjekt} />
        </>
      )}

      {tilsoknadsdialog && !fyllUt && (
        <>
          <KnappSoknadsdialog soknadsobjekt={soknadsobjekt} />
          <KnappPapirSoknad soknadsobjekt={soknadsobjekt} />
        </>
      )}

      {!tilsoknadsdialog && !fyllUt && dokumentinnsending && (
        <>
          <KnappDokumentinnsending soknadsobjekt={soknadsobjekt} />
          <KnappPapirSoknad soknadsobjekt={soknadsobjekt} />
        </>
      )}

      {!tilsoknadsdialog && !fyllUt && !dokumentinnsending && <KnappPapirSoknad soknadsobjekt={soknadsobjekt} />}

      {!tilsoknadsdialog && fyllUt && fyllUt.length > 0 && <KnappFyllUt soknadsobjekt={soknadsobjekt} />}

      {soknadsobjekt.vedleggtilsoknad?.length > 0 && <KnappEttersendelse soknadsobjekt={soknadsobjekt} />}

      <KnappKlage soknadsobjekt={soknadsobjekt} />
    </div>
  );
};

interface Props {
  key: number;
  apen: boolean;
  soknadsobjekt: Soknadsobjekt;
}

const VisSoknadsobjekt = (props: Props & InjectedIntlProps & RouteComponentProps<{}>) => {
  const { locale } = props.intl;
  const { soknadsobjekt, key, apen } = props;
  const { navn, beskrivelse, lenker, hovedskjema, varseltekst } = soknadsobjekt;
  const tilsoknadsdialog = finnesInngangTilSoknadsdialog(soknadsobjekt, locale);
  const dokumentinnsending = finnesDokumentinnsending(soknadsobjekt);
  const fyllUt = finnesFyllUtUrl(soknadsobjekt, locale);

  const markert =
    hentSkjemanummerHash(props.location.hash) === convertNAVSkjemanummerTilHash(hovedskjema.skjemanummer)
      ? "marker"
      : "";

  return (
    <div id={convertNAVSkjemanummerTilHash(hovedskjema.skjemanummer)} className={"ekspandertSoknadsPanel"}>
      <Ekspanderbartpanel
        apen={apen}
        border={false}
        tittel={
          <div className={"ekspanderbartPanel__headingInnhold"}>
            <Undertittel className={markert}>
              <LocaleTekst tekst={navn} />
            </Undertittel>
            {hovedskjema.skjemanummer ? <Normaltekst>{hovedskjema.skjemanummer}</Normaltekst> : null}
          </div>
        }
      >
        <div key={key} className={"soknadsobjekt"}>
          <LocaleBlockTextAlertStripeAdvarsel blockText={varseltekst} locale={locale} />
          <div className="soknadsobjekt__inner">
            <div className="soknadsobjekt__innhold">
              <div>
                {beskrivelse && (
                  <div className="typo-normal soknadsobjekt__beskrivelse">
                    <BlockContent blocks={localeBlockTekst(beskrivelse, locale)} serializers={{ marks: { link } }} />
                  </div>
                )}
              </div>
              {lenker && lenker.length > 0 && <RelevantInformasjon lenker={lenker} locale={locale} />}
            </div>
            <Soknadsinnganger soknadsobjekt={soknadsobjekt} locale={locale} />
          </div>
        </div>
      </Ekspanderbartpanel>
    </div>
  );
};

export default withRouter(injectIntl(VisSoknadsobjekt));
