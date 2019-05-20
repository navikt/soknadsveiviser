import * as React from "react";
import { Underkategori } from "../../../typer/underkategori";
import HovedSoknadsobjekt from "./HovedSoknadsobjekt";
import InformasjonPapirsoknad from "./InformasjonPapirsoknad";
import { injectIntl, InjectedIntlProps } from "react-intl";

interface Props {
  valgtUnderkategori: Underkategori;
}

type MergedProps = Props & InjectedIntlProps;
const Soknadsdialog = (props: MergedProps) => {
  const { valgtUnderkategori, intl } = props;

  const soknadsdialogURL =
    ((valgtUnderkategori.inngangtilsoknadsdialog || {}).soknadsdialogURL || {})[
      intl.locale
    ] || null;

  return soknadsdialogURL ? (
    <>
      <HovedSoknadsobjekt underkategori={valgtUnderkategori} />
      <InformasjonPapirsoknad />
    </>
  ) : null;
};

export default injectIntl(Soknadsdialog);
