import * as React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import VelgTypeKnapp from "./VelgTypeKnapp";
import { Kategori } from "../../../typer/kategori";
import { medKategorier } from "../../../states/providers/Kategorier";
import { Underkategori } from "../../../typer/underkategori";
import { filtrerKategorier } from "../../../utils/kategorier";

interface Props {
  valgtType: "Person" | "Bedrift";
  valgtKategori: Kategori;
  valgtUnderkategori: Underkategori;
  alleKategorier: Kategori[];
}

type MergedProps = Props & InjectedIntlProps;
const Typer = (props: MergedProps) => {
  const { alleKategorier } = props;
  const personKategorier = filtrerKategorier(alleKategorier, "person");
  const bedriftKategorier = filtrerKategorier(alleKategorier, "bedrift");

  return (
    <div role="tablist" className="typeoversikt">
      {personKategorier.length > 0 && <VelgTypeKnapp type="person" />}
      {bedriftKategorier.length > 0 && <VelgTypeKnapp type="bedrift" />}
    </div>
  );
};

export default medKategorier<Props>(injectIntl(Typer));
