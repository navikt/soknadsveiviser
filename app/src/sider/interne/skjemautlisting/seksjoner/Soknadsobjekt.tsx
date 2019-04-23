import React from "react";
import Element from "nav-frontend-typografi/lib/element";
import { Kategori } from "../../../../typer/kategori";
import { Link } from "react-router-dom";
import { Underkategori } from "../../../../typer/underkategori";
import { Soknadsobjekt } from "../../../../typer/soknad";
import { injectIntl, InjectedIntlProps } from "react-intl";
import LocaleTekst from "../../../../komponenter/localetekst/LocaleTekst";

interface Props {
  key: string;
  soknadsobjekt: Soknadsobjekt;
  kategori: Kategori;
  underkategori: Underkategori;
}
const VisSoknadsobjekt = (props: Props & InjectedIntlProps) => {
  const { kategori, underkategori, soknadsobjekt, intl } = props;

  const { hovedskjema } = soknadsobjekt;
  const soknadsdialog = underkategori.inngangtilsoknadsdialog !== undefined;

  const valgtSoknadsobjektHash = window.location.hash
    .replace("%20", " ")
    .split("#")[1];

  const lenkeTilSkjema =
    `/person` +
    `/${kategori.urlparam}` +
    `/${underkategori.urlparam}` +
    !soknadsdialog
      ? `/brev/${hovedskjema.skjemanummer}`
      : "";

  const className = `litenavstand ${
    valgtSoknadsobjektHash === hovedskjema.skjemanummer ? "marker" : " "
  }`;

  return (
    <div id={hovedskjema.skjemanummer} key={props.key} className={className}>
      <Element>{hovedskjema.skjemanummer}</Element>
      <Link className="lenke" to={lenkeTilSkjema}>
        <LocaleTekst tekst={props.soknadsobjekt.navn} />
      </Link>
    </div>
  );
};

export default injectIntl(VisSoknadsobjekt);
