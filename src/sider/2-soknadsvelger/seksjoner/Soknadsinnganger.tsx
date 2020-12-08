import { Soknadsobjekt } from "../../../typer/soknad";
import {
  finnesDokumentinnsending,
  finnesFyllUtUrl,
  finnesInngangTilSoknadsdialog
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
  return (
    <div className="knapper-wrapper litenavstand">
      {tilsoknadsdialog && fyllUt && (
        <>
          <KnappSoknadsdialog soknadsobjekt={soknadsobjekt}/>
          <KnappFyllUtPapir soknadsobjekt={soknadsobjekt}/>
        </>
      )}

      {tilsoknadsdialog && !fyllUt && (
        <>
          <KnappSoknadsdialog soknadsobjekt={soknadsobjekt}/>
          <KnappPapirSoknad soknadsobjekt={soknadsobjekt}/>
        </>
      )}

      {!tilsoknadsdialog && !fyllUt && dokumentinnsending && (
        <>
          <KnappDokumentinnsending soknadsobjekt={soknadsobjekt}/>
          <KnappPapirSoknad soknadsobjekt={soknadsobjekt}/>
        </>
      )}

      {!tilsoknadsdialog && !fyllUt && !dokumentinnsending && <KnappPapirSoknad soknadsobjekt={soknadsobjekt}/>}

      {!tilsoknadsdialog && fyllUt && fyllUt.length > 0 && <KnappFyllUt soknadsobjekt={soknadsobjekt}/>}

      {soknadsobjekt.vedleggtilsoknad?.length > 0 && <KnappEttersendelse soknadsobjekt={soknadsobjekt}/>}

      <KnappKlage soknadsobjekt={soknadsobjekt}/>
    </div>
  );
};
