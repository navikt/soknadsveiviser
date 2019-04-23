import * as React from "react";
import Undertittel from "nav-frontend-typografi/lib/undertittel";
import { injectIntl, InjectedIntlProps } from "react-intl";
import BlockContent from "@sanity/block-content-to-react";
import KnappSoknadsdialog from "../knapper/Soknadsdialog";
import KnappDokumentinnsending from "../knapper/Dokumentinnsending";
import KnappPapirSoknad from "../knapper/PapirSoknad";
import KnappEttersendelse from "../knapper/Ettersendelse";
import KnappKlage from "../knapper/Klage";
import RelevantInformasjon from "./RelevantInformasjon";
import { link } from "../../../utils/serializers";
import { Soknadsobjekt } from "../../../typer/soknad";
import LocaleTekst from "../../../komponenter/localetekst/LocaleTekst";
import { localeBlockTekst } from "../../../utils/sprak";

interface Props {
  key: number;
  soknadsobjekt: Soknadsobjekt;
}

const VisSoknadsobjekt = (props: Props & InjectedIntlProps) => {
  const { soknadsobjekt, key, intl } = props;
  const { navn, beskrivelse, digitalinnsending, lenker } = soknadsobjekt;
  const dokumentinnsending = (digitalinnsending || {}).dokumentinnsending;
  const tilsoknadsdialog = (digitalinnsending || {}).inngangtilsoknadsdialog;

  return (
    <div key={key} className="soknadsobjekt">
      <div className="soknadsobjekt__innhold">
        <div>
          <Undertittel>
            <LocaleTekst tekst={navn} />
          </Undertittel>
          {beskrivelse && (
            <div className="typo-normal soknadsobjekt__beskrivelse">
              <BlockContent
                blocks={localeBlockTekst(beskrivelse, intl.locale)}
                serializers={{ marks: { link } }}
              />
            </div>
          )}
        </div>
        {lenker && lenker.length > 0 && (
          <RelevantInformasjon lenker={lenker} locale={intl.locale} />
        )}
      </div>
      <div className="knapper-wrapper litenavstand">
        {tilsoknadsdialog && (
          <KnappSoknadsdialog soknadsobjekt={soknadsobjekt} />
        )}
        {dokumentinnsending && !tilsoknadsdialog && (
          <KnappDokumentinnsending soknadsobjekt={soknadsobjekt} />
        )}
        <KnappPapirSoknad soknadsobjekt={soknadsobjekt} />
        <KnappEttersendelse soknadsobjekt={soknadsobjekt} />
        <KnappKlage soknadsobjekt={soknadsobjekt} />
      </div>
    </div>
  );
};

export default injectIntl(VisSoknadsobjekt);
