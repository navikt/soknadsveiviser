import React, { SyntheticEvent } from "react";
import { Element, Undertittel } from "nav-frontend-typografi";
import { RadioPanelGruppe } from "nav-frontend-skjema";
import Lesmerpanel from "nav-frontend-lesmerpanel";
import BlockContent from "@sanity/block-content-to-react";
import { link } from "utils/serializers";
import { Soknadsobjekt } from "typer/soknad";
import { Dispatch } from "redux";
import { toggleValgtVedlegg } from "states/reducers/vedlegg";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { Vedleggsobjekt } from "typer/skjemaogvedlegg";
import { LocaleString } from "typer/sprak";
import { localeBlockTekst } from "utils/sprak";
import LocaleTekst from "komponenter/localetekst/LocaleTekst";
import { medValgtSoknadsobjekt } from "states/providers/ValgtSoknadsobjekt";
import { localeVedleggstittel } from "utils/soknadsobjekter";

interface Routes {
  klage: string;
}

interface Props {
  label: LocaleString;
  vedleggsobj: Vedleggsobjekt;
  valgtSoknadsobjekt: Soknadsobjekt;
  klageSoknadsobjekt: Soknadsobjekt;
}

interface ReduxProps {
  toggleValgtVedlegg: (
    _key: string,
    soknadsobjektId: string,
    klage: boolean
  ) => void;
}

type MergedProps = Props &
  InjectedIntlProps &
  RouteComponentProps<Routes> &
  ReduxProps;

const Sporsmal = (props: MergedProps) => {
  const { label, vedleggsobj } = props;
  const { intl, valgtSoknadsobjekt, toggleValgtVedlegg } = props;
  const { klage } = props.match.params;

  const handleOnChange = (
    event: SyntheticEvent<EventTarget, Event>,
    value?: string
  ) => value && toggleValgtVedlegg(value, valgtSoknadsobjekt._id, !!klage);

  return (
    <div className="maks-bredde vedlegg__sporsmal">
      <Undertittel>
        <LocaleTekst tekst={label} />
      </Undertittel>
      {vedleggsobj.beskrivelse && (
        <Lesmerpanel
          className="vedlegg__lesmer"
          lukkTekst={intl.formatMessage({ id: "velgvedlegg.lesmer.lukk" })}
          apneTekst={intl.formatMessage({ id: "velgvedlegg.lesmer.apne" })}
        >
          <div className="typo-normal">
            <BlockContent
              blocks={localeBlockTekst(vedleggsobj.beskrivelse, intl.locale)}
              serializers={{ marks: { link } }}
            />
          </div>
        </Lesmerpanel>
      )}
      <div>
        <RadioPanelGruppe
          className="vedlegg__sjekkbokser"
          key={vedleggsobj._key}
          legend={""}
          name={vedleggsobj._key}
          radios={[
            {
              label: intl.formatMessage({ id: "velgvedlegg.ja" }),
              value: vedleggsobj._key
            },
            {
              label: intl.formatMessage({ id: "velgvedlegg.nei" }),
              value: "ikke" + vedleggsobj._key
            }
          ]}
          checked={
            vedleggsobj.skalSendes
              ? vedleggsobj._key
              : vedleggsobj.skalSendes === false
              ? "ikke" + vedleggsobj._key
              : ""
          }
          onChange={handleOnChange}
        />
        <div
          className="vedlegg__sjekkbokser-vedleggsnavn"
          style={vedleggsobj.skalSendes ? undefined : { visibility: "hidden" }}
        >
          <Element>
            <FormattedMessage id="velgvedlegg.vedlegg" />
            <span>{localeVedleggstittel(vedleggsobj, intl.locale)}</span>
          </Element>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  toggleValgtVedlegg: (_key: string, soknadsobjektId: string, klage: boolean) =>
    dispatch(toggleValgtVedlegg(_key, soknadsobjektId, klage))
});

export default medValgtSoknadsobjekt<Props>(
  injectIntl<Props & InjectedIntlProps>(
    withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>, any>(
      connect(
        undefined,
        mapDispatchToProps
      )(Sporsmal)
    )
  )
);
