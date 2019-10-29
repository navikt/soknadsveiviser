import * as React from "react";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import Systemtittel from "nav-frontend-typografi/lib/systemtittel";
import dokument from "../../img/dokument.svg";
import { Kategori } from "../../typer/kategori";
import { Underkategori } from "../../typer/underkategori";
import { medKategorier } from "../../states/providers/Kategorier";

interface Props {
  tittel?: string;
  children?: React.ReactNode
  valgtType: "Person" | "Bedrift";
  valgtKategori: Kategori;
  valgtUnderkategori: Underkategori;
  alleKategorier: Kategori[];
}

type MergedProps = Props & InjectedIntlProps;
const Steg = (props: MergedProps) => {
  const { valgtKategori } = props;
  const kategoriFarge = valgtKategori
    ? valgtKategori.domenefarge
    : "@navLysGra";

  return (
    <div className="stegBanner">
      <div className="stegBanner__ikon-wrapper">
        <div className="circle" style={{ background: kategoriFarge }}>
          <img alt="Steg" src={dokument} className="stegBanner__ikon" />
        </div>
      </div>
      {props.tittel && (
        <div className="stegBanner__seksjon">
          <Systemtittel className="stegBanner__tittel">
            <FormattedMessage id={props.tittel} />
          </Systemtittel>
        </div>
      )}
      {props.children}
    </div>
  );
};

export default medKategorier<Props>(
  injectIntl<Props & InjectedIntlProps>(Steg)
);
