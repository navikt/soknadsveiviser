import * as React from "react";
import { Kategori } from "../../../../../typer/kategori";
import { FormattedMessage } from "react-intl";
import { erKategoriValgt } from "../../../../../utils/kategorier";
import VelgKategoriKnapp from "../knapper/VelgKategori";
import { Undertekst } from "nav-frontend-typografi";

interface Props {
  valgtKategori: Kategori;
  aktiveKategorier: Kategori[];
}

const Desktop = (props: Props) => {
  const { valgtKategori, aktiveKategorier } = props;

  if (!valgtKategori) {
    return null;
  }

  return (
    <nav className="tabs desktop">
      <ul>
        <li className="element">
          <Undertekst>
            <FormattedMessage id="kategori.velg" />
          </Undertekst>
        </li>
        {aktiveKategorier.map((kategori, id) => {
          const { kantfarge } = valgtKategori;
          const erValgt = erKategoriValgt(kategori, valgtKategori);
          const style = erValgt ? { borderLeftColor: kantfarge } : {};
          return (
            <VelgKategoriKnapp
              key={id}
              kategori={kategori}
              erValgt={erValgt}
              style={style}
            />
          );
        })}
      </ul>
    </nav>
  );
};

export default Desktop;
