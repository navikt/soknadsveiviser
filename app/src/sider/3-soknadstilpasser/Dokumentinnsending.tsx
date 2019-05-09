import React, { Component } from "react";
import VelgVedlegg from "./felles/velgvedlegg/VelgVedlegg";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import Underbanner from "../../komponenter/bannere/Underbanner";
import { Vedleggsobjekt } from "../../typer/vedlegg";
import { Store } from "../../typer/store";
import { Soknadsobjekt } from "../../typer/soknad";
import { connect } from "react-redux";
import { getTjenesteUrl } from "../../config";
import DineVedlegg from "./felles/dinevedlegg/DineVedlegg";
import { localeTekst } from "../../utils/sprak";
import { medValgtSoknadsobjekt } from "../../states/providers/ValgtSoknadsobjekt";

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

class VedleggssideDokumentinnsending extends Component<MergedProps> {
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

    const relevanteVedlegg = valgteVedlegg
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
        <DineVedlegg relevanteVedlegg={relevanteVedlegg} />
        <div className="knapp__neste">
          <a
            className="knapp knapp--hoved"
            href={this.genererDokumentinnsendingsUrl(
              valgtSoknadsobjekt,
              valgteVedlegg
            )}
          >
            <FormattedMessage id="personalia.knapp" />
          </a>
        </div>
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
      connect(mapStateToProps)(VedleggssideDokumentinnsending)
    )
  )
);
