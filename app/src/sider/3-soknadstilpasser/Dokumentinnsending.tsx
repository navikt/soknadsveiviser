import React, { Component } from "react";
import VelgVedlegg from "./felles/velgvedlegg/VelgVedlegg";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import Underbanner from "../../komponenter/bannere/Underbanner";
import { Vedleggsobjekt } from "../../typer/vedlegg";
import { Store } from "../../typer/store";
import { Soknadsobjekt } from "../../typer/soknad";
import { connect } from "react-redux";
import { getTjenesteUrl } from "../../config";
import DineVedlegg from "./felles/DineVedlegg";
import { localeTekst, sideTittel } from "../../utils/sprak";
import { medValgtSoknadsobjekt } from "../../states/providers/ValgtSoknadsobjekt";
import Neste from "./felles/personalia/knapper/Neste";

interface Props {
  valgtSoknadsobjekt: Soknadsobjekt;
}

interface Routes {
  skjemanummer: string;
  kategori: string;
  underkategori: string;
}

interface ReduxProps {
  valgteVedlegg: Vedleggsobjekt[];
}

type MergedProps = Props &
  ReduxProps &
  RouteComponentProps<Routes> &
  InjectedIntlProps;

class Dokumentinnsending extends Component<MergedProps> {
  genererDokumentinnsendingsUrl = (
    valgtSoknadsobjekt: Soknadsobjekt,
    vedlegg: Vedleggsobjekt[]
  ) => {
    const { hovedskjema } = valgtSoknadsobjekt;
    const vedleggTilInnsending = vedlegg
      .filter(v => v.soknadsobjektId === valgtSoknadsobjekt._id)
      .filter(v => v.skalSendes || v.pakrevd)
      .map(ved => ved.vedlegg.vedleggsid)
      .toString();

    return (
      getTjenesteUrl() +
      "/dokumentinnsending/opprettSoknadResource?skjemanummer=" +
      hovedskjema.skjemanummer +
      "&erEttersendelse=false" +
      (vedleggTilInnsending ? "&vedleggsIder=" + vedleggTilInnsending : "")
    );
  };

  render() {
    const { intl, valgteVedlegg, valgtSoknadsobjekt } = this.props;
    const { hovedskjema } = valgtSoknadsobjekt;

    document.title = sideTittel(
      `${localeTekst(
        valgtSoknadsobjekt.navn,
        intl.locale
      )}  - ${intl.formatMessage({
        id: "tittel.soknader"
      })}`
    );

    const vedleggTilInnsending = valgteVedlegg
      .filter(v => v.soknadsobjektId === valgtSoknadsobjekt._id)
      .filter(v => v.skalSendes || v.pakrevd);

    return (
      <>
        <Underbanner
          tittel={localeTekst(valgtSoknadsobjekt.navn, intl.locale)}
          undertittel={localeTekst(hovedskjema.navn, intl.locale)}
          skjemanummer={hovedskjema.skjemanummer}
        />
        <VelgVedlegg soknadsobjekt={valgtSoknadsobjekt} />
        <DineVedlegg vedleggTilInnsending={vedleggTilInnsending} />
        <Neste
          lenke={this.genererDokumentinnsendingsUrl(
            valgtSoknadsobjekt,
            valgteVedlegg
          )}
        />
      </>
    );
  }
}

const mapStateToProps = (store: Store) => ({
  valgteVedlegg: store.vedlegg.valgteVedlegg
});

export default medValgtSoknadsobjekt<Props>(
  injectIntl<Props & InjectedIntlProps>(
    withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>>(
      connect(mapStateToProps)(Dokumentinnsending)
    )
  )
);
