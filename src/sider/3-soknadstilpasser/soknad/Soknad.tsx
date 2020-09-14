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
import {SjekkbokserMedUtskiltePaakrevde} from "../felles/velgvedlegg/Sjekkbokser";
import Personalia from "../felles/personalia/Personalia";
import { Store } from "../../../typer/store";
import { medValgtSoknadsobjekt } from "../../../states/providers/ValgtSoknadsobjekt";
import { connect } from "react-redux";
import { getToggleValue } from "../felles/velgvedlegg/Utils";
import infoIkon from "../../../img/info-ikon.svg";
import Neste from "../felles/personalia/knapper/Neste";
import { genererDokumentinnsendingsUrl } from "../felles/dokumentinnsendingUtils";
import { finnesDokumentinnsending } from "../../../utils/soknadsobjekter";
import Helmet from "react-helmet";

interface Props {
  valgtSoknadsobjekt: Soknadsobjekt;
}

interface Routes {
  innsendingsmate: string;
  personEllerBedrift: string;
}

interface ReduxProps {
  valgteVedlegg: Vedleggsobjekt[];
}

type MergedProps = Props &
  ReduxProps &
  RouteComponentProps<Routes> &
  InjectedIntlProps;

const Soknad = (props: MergedProps) => {
  const { intl } = props;
  const { valgteVedlegg, valgtSoknadsobjekt, match } = props;
  const { hovedskjema } = valgtSoknadsobjekt;
  const { innsendingsmate, personEllerBedrift } = match.params;

  const [visVeiledendeSporsmal, setVisVeiledendeSporsmal] = useState<boolean|undefined>();
  const [tilDokumentinnsending, setTilDokumentinnsending] = useState(false);

  const relevanteVedlegg = valgteVedlegg.filter(
    v => v.soknadsobjektId === valgtSoknadsobjekt._id
  );
  const vedleggTilInnsending = relevanteVedlegg.filter(
    v => v.skalSendes || v.pakrevd
  );
  const ikkePakrevdeVedlegg = relevanteVedlegg.filter(
    v => !v.pakrevd
  );
  const vedleggSvart = ikkePakrevdeVedlegg.filter(
    vedlegg => vedlegg.skalSendes !== undefined
  );
  let svartPaAlleSporsmal =
    ikkePakrevdeVedlegg.length === vedleggSvart.length ||
    !visVeiledendeSporsmal;

  const onClick = (
    event: SyntheticEvent<EventTarget>,
    toggles: ToggleKnappPureProps[]
  ) => {
    let pressedToggleIndexString = toggles
      .findIndex(toggle => toggle.pressed === true)
      .toString();
    let newValue = getToggleValue(pressedToggleIndexString);
    if (visVeiledendeSporsmal !== newValue) {
      setVisVeiledendeSporsmal(newValue);
    }
  };

  useEffect(() => {
    valgtSoknadsobjekt.vedleggtilsoknad?.filter(v => !v.pakrevd).length <= 1 && setVisVeiledendeSporsmal(true);
  }, [valgtSoknadsobjekt.vedleggtilsoknad]);

  useEffect(() => {
    if (
      innsendingsmate === "dokumentinnsending" &&
      finnesDokumentinnsending(valgtSoknadsobjekt)
    ) {
      setTilDokumentinnsending(true);
    }
  }, [innsendingsmate, valgtSoknadsobjekt]);

  const title = sideTittel(
    `${localeTekst(
      valgtSoknadsobjekt.navn,
      intl.locale
    )}  - ${intl.formatMessage({ id: "tittel.soknader" })}`
  );
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
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
                    {personEllerBedrift === "bedrift" ? (
                      <FormattedMessage id="velgvedlegg.informasjonspanel.ingress.bedrift" />
                    ) : (
                      <FormattedMessage id="velgvedlegg.informasjonspanel.ingress.person" />
                    )}
                  </Normaltekst>
                </div>
                <div className="papirsoknad__vedleggsvalgtoggle papirsoknad__vedleggsvalgtoggle--container">
                  <Element>
                    <FormattedMessage id="velgvedlegg.informasjonspanel.sporsmal" />
                  </Element>
                  <ToggleGruppe
                    defaultToggles={[
                      {
                        children: (
                          <FormattedMessage id="vedleggsvalg.toggle.veiledning" />
                        )
                      },
                      {
                        children: (
                          <FormattedMessage id="vedleggsvalg.toggle.ikkeveiledning" />
                        )
                      }
                    ]}
                    onChange={onClick}
                  />
                </div>
                {visVeiledendeSporsmal !== undefined && (
                  <div className="papirsoknad__vedleggsvalgtoggle--info">
                    <img src={infoIkon} alt="" />
                    <Element style={{ margin: "3px 0 0 5px" }}>
                      {visVeiledendeSporsmal ? (
                        <FormattedMessage id="vedleggsvalg.toggle.info.ja" />
                      ) : (
                        <FormattedMessage id="vedleggsvalg.toggle.info.nei" />
                      )}
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
                  <VeiledendeVedleggsvalg soknadsobjekt={valgtSoknadsobjekt} />
                  {svartPaAlleSporsmal && (
                    <>
                      <DineVedlegg
                        visRadioButtons={!tilDokumentinnsending}
                        visErVedleggPakrevd={true}
                        vedleggTilInnsending={vedleggTilInnsending}
                      />
                      {tilDokumentinnsending ? (
                        <Neste
                          lenke={genererDokumentinnsendingsUrl(
                            valgtSoknadsobjekt,
                            vedleggTilInnsending,
                            false
                          )}
                          disabled={!svartPaAlleSporsmal}
                        />
                      ) : (
                        <Personalia nesteDisabled={!svartPaAlleSporsmal} />
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <SjekkbokserMedUtskiltePaakrevde
                    soknadsobjekt={valgtSoknadsobjekt}
                  />
                  {tilDokumentinnsending ? (
                    <Neste
                      lenke={genererDokumentinnsendingsUrl(
                        valgtSoknadsobjekt,
                        vedleggTilInnsending,
                        false
                      )}
                      disabled={!svartPaAlleSporsmal}
                    />
                  ) : (
                    <Personalia nesteDisabled={!svartPaAlleSporsmal} />
                  )}
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {tilDokumentinnsending ? (
            <Neste
              lenke={genererDokumentinnsendingsUrl(
                valgtSoknadsobjekt,
                vedleggTilInnsending,
                false
              )}
              disabled={!svartPaAlleSporsmal}
            />
          ) : (
            <Personalia nesteDisabled={!svartPaAlleSporsmal} />
          )}
        </>
      )}
    </>
  );
};

const mapStateToProps = (store: Store) => ({
  valgteVedlegg: store.vedlegg.valgteVedlegg
});

export default medValgtSoknadsobjekt<Props>(
  injectIntl<Props & InjectedIntlProps>(
    withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>, any>(
      connect(mapStateToProps)(Soknad)
    )
  )
);
