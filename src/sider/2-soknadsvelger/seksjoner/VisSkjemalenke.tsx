import * as React from "react";
import { Undertittel, Normaltekst, Element } from "nav-frontend-typografi";
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl";
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
import { utlistingAvPDFerBasertPaSprak } from "../../interne/skjemautlisting/tabeller/innslagITabell";

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
  const { navn, beskrivelse, infoLenker, hovedskjema } = skjemalenke;

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
          <div className="knapper-wrapper litenavstand">
            <Element><FormattedMessage id="skjemalenke.lastned" /></Element>
            <div>{utlistingAvPDFerBasertPaSprak(skjemalenke.hovedskjema)}</div>
          </div>
        </div>
      </EkspanderbartpanelBase>
    </div>
  );
};

export default withRouter(injectIntl(VisSkjemalenke));
