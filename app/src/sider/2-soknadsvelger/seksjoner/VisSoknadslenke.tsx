import * as React from "react";
import Undertittel from "nav-frontend-typografi/lib/undertittel";
import { injectIntl, InjectedIntlProps } from "react-intl";
import BlockContent from "@sanity/block-content-to-react";
import RelevantInformasjon from "./RelevantInformasjon";
import { link } from "../../../utils/serializers";
import { Soknadslenke } from "../../../typer/soknad";
import LocaleTekst from "../../../komponenter/localetekst/LocaleTekst";
import { localeBlockTekst, localeTekst } from "../../../utils/sprak";

interface Props {
  key: number;
  soknadslenke: Soknadslenke;
}

const VisSoknadslenke = (props: Props & InjectedIntlProps) => {
  const { soknadslenke, key, intl } = props;
  const { navn, beskrivelse, lenke, infoLenker } = soknadslenke;

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
        {infoLenker && infoLenker.length > 0 && (
          <RelevantInformasjon lenker={infoLenker} locale={intl.locale} />
        )}
      </div>
      <div className="knapper-wrapper litenavstand">
        <a
          href={localeTekst(lenke.lenke, intl.locale)}
          className="knapp knapp--hoved"
        >
          <LocaleTekst tekst={lenke.tekst} />
        </a>
      </div>
    </div>
  );
};

export default injectIntl(VisSoknadslenke);
