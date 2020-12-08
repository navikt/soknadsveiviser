import { Soknadsobjekt } from "../../../typer/soknad";
import {
  finnesDokumentinnsending,
  finnesFyllUtUrl,
  finnesInngangTilSoknadsdialog,
} from "../../../utils/soknadsobjekter";
import KnappSoknadsdialog from "../knapper/Soknadsdialog";
import KnappFyllUtPapir from "../knapper/FyllUtPapir";
import KnappPapirSoknad from "../knapper/PapirSoknad";
import KnappDokumentinnsending from "../knapper/Dokumentinnsending";
import KnappFyllUt from "../knapper/FyllUt";
import KnappEttersendelse from "../knapper/Ettersendelse";
import KnappKlage from "../knapper/Klage";
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
