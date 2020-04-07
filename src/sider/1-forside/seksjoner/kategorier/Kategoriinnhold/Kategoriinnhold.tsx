import * as React from "react";
import Underkategorier from "../../underkategorier/Underkategorier";
import Hovedbanner from "../../../../../komponenter/bannere/Hovedbanner";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { Kategori } from "../../../../../typer/kategori";
import { Underkategori } from "../../../../../typer/underkategori";
import { localeTekst } from "../../../../../utils/sprak";
import { medKategorier } from "../../../../../states/providers/Kategorier";
import {Helmet} from "react-helmet";

interface Props {
  valgtType: "Person" | "Bedrift";
  valgtKategori: Kategori;
  valgtUnderkategori: Underkategori;
  alleKategorier: Kategori[];
}

type MergedProps = Props & InjectedIntlProps;
const Kategoriinnhold = (props: MergedProps) => {
  const { intl, valgtKategori } = props;
  const tittel = localeTekst(valgtKategori.tittel, intl.locale);
  return (
    <div className="kategoriinnhold__container">
      <Helmet>
        <meta name="description" content={`${tittel} - søknad, skjema, ettersendelse og klage`} />
      </Helmet>
      <Hovedbanner
        tittel={tittel}
        backgroundColor={valgtKategori.domenefarge}
        borderColor={valgtKategori.kantfarge}
      />
      <Underkategorier valgtKategori={valgtKategori} {...props} />
    </div>
  );
};

export default medKategorier<Props>(injectIntl<MergedProps>(Kategoriinnhold));
