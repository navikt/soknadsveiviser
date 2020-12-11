import { Soknadsobjekt } from "../../../typer/soknad";
import {
  finnesDokumentinnsending,
  finnesFyllUtUrl,
  finnesInngangTilSoknadsdialog,
} from "../../../utils/soknadsobjekter";
import KnappSoknadsdialog from "../knapper/Soknadsdialog";
import KnappPapirSoknad from "../knapper/PapirSoknad";
import KnappDokumentinnsending from "../knapper/Dokumentinnsending";
import {KnappFyllUt, KnappFyllUtPapir} from "../knapper/FyllUt";
import * as React from "react";

interface SoknadsinngangerProps {
  soknadsobjekt: Soknadsobjekt;
  locale: string;
}

export const Soknadsinnganger = (props: SoknadsinngangerProps) => {
  const { locale, soknadsobjekt } = props;
  const tilsoknadsdialog = finnesInngangTilSoknadsdialog(soknadsobjekt, locale);
  const dokumentinnsending = finnesDokumentinnsending(soknadsobjekt);
  const fyllUt = finnesFyllUtUrl(soknadsobjekt, locale);
  if (tilsoknadsdialog) {
    return <>
      <KnappSoknadsdialog soknadsobjekt={soknadsobjekt} />
      {fyllUt ? <KnappFyllUtPapir soknadsobjekt={soknadsobjekt} /> : <KnappPapirSoknad soknadsobjekt={soknadsobjekt} />}
      </>
  } else {
    if (fyllUt) {
      return <KnappFyllUt soknadsobjekt={soknadsobjekt} />;
    } else {
        return (
          <>
            {dokumentinnsending && <KnappDokumentinnsending soknadsobjekt={soknadsobjekt} /> }
            <KnappPapirSoknad soknadsobjekt={soknadsobjekt} />
          </>
        );
    }
  }
};
