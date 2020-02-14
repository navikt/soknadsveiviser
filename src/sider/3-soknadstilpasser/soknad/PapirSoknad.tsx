import React, { SyntheticEvent, useEffect, useState } from "react";
import { Soknadsobjekt } from "../../../typer/soknad";
import { Vedleggsobjekt } from "../../../typer/skjemaogvedlegg";
import { RouteComponentProps, withRouter } from "react-router";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { localeTekst, sideTittel } from "../../../utils/sprak";
import Underbanner from "../../../komponenter/bannere/Underbanner";
import Steg from "../../../komponenter/bannere/Steg";
import { Element, Normaltekst } from "nav-frontend-typografi";
import { ToggleGruppe, ToggleKnappPureProps } from "nav-frontend-toggle";
import VeiledendeVedleggsvalg from "../felles/velgvedlegg/VeiledendeVedleggsvalg";
import DineVedlegg from "../felles/dinevedlegg/DineVedlegg";
import Sjekkbokser from "../felles/velgvedlegg/Sjekkbokser";
import Personalia from "../felles/personalia/Personalia";
import { Store } from "../../../typer/store";
import { medValgtSoknadsobjekt } from "../../../states/providers/ValgtSoknadsobjekt";
import { connect } from "react-redux";
import { getToggleValue } from "../felles/velgvedlegg/Utils";
import infoIkon from "../../../img/info-ikon.svg";

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

const PapirSoknad = (props: MergedProps) => {
  const {intl} = props;
  const {valgteVedlegg, valgtSoknadsobjekt} = props;
  const {hovedskjema} = valgtSoknadsobjekt;

  const [visVeiledendeSporsmal, setVisVeiledendeSporsmal] = useState();

  const relevanteVedlegg = valgteVedlegg.filter(v => v.soknadsobjektId === valgtSoknadsobjekt._id);
  const vedleggTilInnsending = relevanteVedlegg.filter(v => v.skalSendes || v.pakrevd);
  const ikkePakrevdeVedlegg = relevanteVedlegg.filter(v => !v.pakrevd);
  const vedleggSvart = ikkePakrevdeVedlegg.filter(vedlegg => vedlegg.skalSendes !== undefined);
  let svartPaAlleSporsmal = ikkePakrevdeVedlegg.length === vedleggSvart.length || !visVeiledendeSporsmal;

  const onClick = (
    event: SyntheticEvent<EventTarget>,
    toggles: ToggleKnappPureProps[]
  ) => {
    let pressedToggleIndexString = toggles.findIndex(toggle => toggle.pressed === true).toString();
    let newValue = getToggleValue(pressedToggleIndexString);
    if (visVeiledendeSporsmal !== newValue) {
      setVisVeiledendeSporsmal(newValue);
    }
  };

  useEffect(() => {
    document.title = sideTittel(
      `${localeTekst(
        valgtSoknadsobjekt.navn,
        intl.locale
      )}  - ${intl.formatMessage({id: "tittel.soknader"})}`);
  },        [valgtSoknadsobjekt.navn, intl]);

  useEffect(() => {
    (ikkePakrevdeVedlegg.length <= 1) && setVisVeiledendeSporsmal(true);
  },        [ikkePakrevdeVedlegg]);

  return (
    <>
      <Underbanner
        tittel={localeTekst(valgtSoknadsobjekt.navn, intl.locale)}
        skjemanummer={hovedskjema.skjemanummer}
      />
      {relevanteVedlegg.length > 0 ? (
        <>
          <Steg tittel="velgvedlegg.informasjonspanel.tittel">
            {ikkePakrevdeVedlegg.length > 1 && (
              <>
                <div className="stegBanner__seksjon stegBanner__ingress">
                  <Normaltekst>
                    <FormattedMessage id="velgvedlegg.informasjonspanel.ingress"/>
                  </Normaltekst>
                </div>
                <div className="papirsoknad__vedleggsvalgtoggle papirsoknad__vedleggsvalgtoggle--container">
                  <Element><FormattedMessage id="velgvedlegg.informasjonspanel.sporsmal"/></Element>
                  <ToggleGruppe
                    defaultToggles={[
                      {
                        children: (
                          <FormattedMessage id="vedleggsvalg.toggle.veiledning"/>
                        )
                      },
                      {

                        children: (
                          <FormattedMessage id="vedleggsvalg.toggle.ikkeveiledning"/>
                        )
                      }
                    ]}
                    onChange={(event, toggles) => onClick(event, toggles)}
                  />
                </div>
                {visVeiledendeSporsmal !== undefined && (
                  <div className="papirsoknad__vedleggsvalgtoggle--info">
                    <img src={infoIkon} alt="" />
                    <Element style={{margin: "3px 0 0 5px"}}>
                      {visVeiledendeSporsmal ?
                        <FormattedMessage id="vedleggsvalg.toggle.info.ja"/>
                        : <FormattedMessage id="vedleggsvalg.toggle.info.nei" />}
                    </Element>
                  </div>
                )}
              </>
            )}
          </Steg>
          {visVeiledendeSporsmal !== undefined && (
            <>
              {visVeiledendeSporsmal ? (
                <>
                  <VeiledendeVedleggsvalg soknadsobjekt={valgtSoknadsobjekt}/>
                  {svartPaAlleSporsmal && (
                    <>
                      <DineVedlegg
                        visRadioButtons={true}
                        visErVedleggPakrevd={true}
                        vedleggTilInnsending={vedleggTilInnsending}
                      />
                      <Personalia nesteDisabled={!svartPaAlleSporsmal}/>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Sjekkbokser
                    soknadsobjekt={valgtSoknadsobjekt}
                    skillUtPakrevde={true}
                  />
                  <Personalia nesteDisabled={!svartPaAlleSporsmal}/>
                </>
              )}
            </>
          )}
        </>
      ) : <Personalia nesteDisabled={!svartPaAlleSporsmal}/>}
    </>
  );
};

const mapStateToProps = (store: Store) => ({
  valgteVedlegg: store.vedlegg.valgteVedlegg
});

export default medValgtSoknadsobjekt<Props>(
  injectIntl<Props & InjectedIntlProps>(
    withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>, any>(
      connect(mapStateToProps)(PapirSoknad)
    )
  )
);
