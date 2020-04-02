import * as React from "react";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import { injectIntl, InjectedIntlProps } from "react-intl";
import BlockContent from "@sanity/block-content-to-react";
import RelevantInformasjon from "./RelevantInformasjon";
import { link } from "utils/serializers";
import { Skjemalenke } from "typer/soknad";
import LocaleTekst from "komponenter/localetekst/LocaleTekst";
import { localeBlockTekst } from "utils/sprak";
import { RouteComponentProps, withRouter } from "react-router";
import { hentSkjemanummerHash } from "utils/hentSkjemanummerHash";
import { convertNAVSkjemanummerTilHash } from "utils/hentSkjemanummerHash";
import EkspanderbartpanelBase from "nav-frontend-ekspanderbartpanel/lib/ekspanderbartpanel-base";
import { Skjemalenkeliste, Fillenke } from "./Skjemalenker";
import LocaleBlockTextAdvarsel from "../../../komponenter/felles/LocaleBlockTextAdvarsel";

interface Props {
  key: number;
  apen: boolean;
  skjemalenke: Skjemalenke;
}

const VisSkjemalenke = (
  props: Props & InjectedIntlProps & RouteComponentProps<{}>
) => {
  const { locale } = props.intl;
  const { skjemalenke, key, apen } = props;
  const { navn, beskrivelse, infoLenker, hovedskjema, varseltekst } = skjemalenke;
  const { pdf, skjemanummer } = hovedskjema;

  const markert =
    hentSkjemanummerHash(props.location.hash) ===
    convertNAVSkjemanummerTilHash(hovedskjema.skjemanummer)
      ? "marker"
      : "";

  return (
    <div
      id={convertNAVSkjemanummerTilHash(hovedskjema.skjemanummer)}
      className={"ekspandertSoknadsPanel"}
    >
      <EkspanderbartpanelBase
        apen={apen}
        heading={
          <div className={"ekspanderbartPanel__headingInnhold"}>
            <Undertittel className={markert}>
              <LocaleTekst tekst={navn} />
            </Undertittel>
            {hovedskjema.skjemanummer ? (
              <Normaltekst>{hovedskjema.skjemanummer}</Normaltekst>
            ) : null}
          </div>
        }
      >
        <div key={key} className={"soknadsobjekt"}>
          <div className="soknadsobjekt__advarsel">
            <LocaleBlockTextAdvarsel blockText={varseltekst} locale={locale}/>
          </div>
          <div className="soknadsobjekt__inner">
            <div className="soknadsobjekt__innhold">
              <div>
                {beskrivelse && (
                  <div className="typo-normal soknadsobjekt__beskrivelse">
                    <BlockContent
                      blocks={localeBlockTekst(beskrivelse, locale)}
                      serializers={{ marks: { link } }}
                    />
                  </div>
                )}
              </div>
              {infoLenker && infoLenker.length > 0 && (
                <RelevantInformasjon lenker={infoLenker} locale={locale} />
              )}
            </div>
            <Skjemalenkeliste pdf={pdf} skjemanummer={skjemanummer}>
              {Object.entries(pdf)
                .filter(([, file]) => file?.asset?.url)
                .map(([key, file]) => (
                  <Fillenke
                    key={key}
                    languageKey={key}
                    file={file}
                    skjemanummer={hovedskjema.skjemanummer}
                  />
                ))}
            </Skjemalenkeliste>
          </div>
        </div>
        </EkspanderbartpanelBase>

    </div>
  );
};

export default withRouter(injectIntl(VisSkjemalenke));
