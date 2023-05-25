import * as React from "react";
import { Underkategori } from "../../../typer/underkategori";
import Undertittel from "nav-frontend-typografi/lib/undertittel";
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl";
import BlockContent from "@sanity/block-content-to-react";
import RelevantInformasjon from "./RelevantInformasjon";
import { getEttersendingUrl } from "../../../config";
import { link } from "../../../utils/serializers";
import { Normaltekst } from "nav-frontend-typografi";
import { HashLink } from "react-router-hash-link";
import {localeTekst, localeBlockTekst} from "../../../utils/sprak";
import LocaleBlockTextAlertStripeAdvarsel from "../../../komponenter/felles/LocaleBlockTextAlertStripeAdvarsel";

interface Props {
  underkategori: Underkategori;
}

const HovedSoknadsobjekt = (props: Props & InjectedIntlProps) => {
  const { underkategori } = props;
  const { locale } = props.intl;
  const {
    beskrivelse,
    varseltekst,
    soknadsdialogURL,
    lenker,
    ettersendelse
  } = underkategori.inngangtilsoknadsdialog;
  return (
    <div className="soknadsobjekt">
        <LocaleBlockTextAlertStripeAdvarsel blockText={varseltekst} locale={locale}/>
    <div className="soknadsobjekt__inner">

      <div className="soknadsobjekt__innhold">
        <div>
          <Undertittel>
            <FormattedMessage id="vissoknadsobjekter.tittel" />
            {` ${localeTekst(underkategori.navn, locale).toLowerCase()}`}
          </Undertittel>
          {beskrivelse && (
            <div className="typo-normal soknadsobjekt__beskrivelse">
              <BlockContent
                blocks={localeBlockTekst(beskrivelse, locale)}
                serializers={{ marks: { link } }}
              />
            </div>
          )}
        </div>
        {lenker && lenker.length > 0 && (
          <RelevantInformasjon lenker={lenker} locale={locale} />
        )}
      </div>
      <div className="knapper-wrapper litenavstand">
        <a href={soknadsdialogURL![locale]} className="knapp knapp--hoved">
          <FormattedMessage id="vissoknadsobjekter.knapp.soknadsdialog" />
        </a>
        <HashLink
          smooth={true}
          to="#papirsoknader"
          className="soknadsobjekt__lenke lenke"
        >
          <Normaltekst>
            <FormattedMessage id="vissoknadsobjekter.ikkeelektroniskID" />
          </Normaltekst>
        </HashLink>
        {!(ettersendelse && ettersendelse.ikkeVisEttersendelse) && (
          <a
            href={
              ettersendelse &&
              ettersendelse.ettersendelsesURL &&
              ettersendelse.ettersendelsesURL.nb
                ? localeTekst(ettersendelse.ettersendelsesURL, locale)
                : getEttersendingUrl()
            }
            className="soknadsobjekt__knapp knapp knapp-hoved"
          >
            <FormattedMessage id="ettersendelser.mellomledd.digital.knapp" />
          </a>
        )}
      </div>
      </div>
    </div>
  );
};


export default injectIntl(HovedSoknadsobjekt);
