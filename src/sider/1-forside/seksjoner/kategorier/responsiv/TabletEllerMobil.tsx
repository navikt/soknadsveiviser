import * as React from "react";
import { Kategori } from "../../../../../typer/kategori";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { erKategoriValgt } from "../../../../../utils/kategorier";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import VelgKategoriKnapp from "../knapper/VelgKategori";

interface Props {
  erTablet: boolean;
  valgtKategori?: Kategori;
  aktiveKategorier: Kategori[];
}

type MergedProps = Props & InjectedIntlProps;
const TabletEllerMobil = (props: MergedProps) => {
  const { valgtKategori, intl, aktiveKategorier, erTablet } = props;

  if (!valgtKategori) {
    return null;
  }

  return (
    <div className="innhold__container">
      <div className="tabs mobil">
        <Ekspanderbartpanel
          apen={erTablet ? true : false}
          tittel={intl.messages["kategori.velg"]}
        >
          <ul>
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
        </Ekspanderbartpanel>
      </div>
    </div>
  );
};

export default injectIntl<Props & InjectedIntlProps>(TabletEllerMobil);
