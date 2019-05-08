import React, { ChangeEvent } from "react";
import { Vedleggsobjekt } from "../../../typer/vedlegg";
import { Normaltekst, Undertittel, Element } from "nav-frontend-typografi";
import LocaleTekst from "../../../komponenter/localetekst/LocaleTekst";
import { settValgtVedleggSkalEttersendes } from "../../../states/reducers/vedlegg";
import {
  medValgtSoknadsobjekt,
  ValgtSoknad
} from "../../../states/providers/ValgtSoknadsobjekt";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RadioPanel } from "nav-frontend-skjema";

import { Radio } from "nav-frontend-skjema";

interface Props {
  relevanteVedlegg: Vedleggsobjekt[];
}

interface ReduxProps {
  settValgtVedleggSkalEttersendes: (
    vedleggId: string,
    skalEttersendes: boolean
  ) => void;
}

type MergedProps = Props & ValgtSoknad & InjectedIntlProps & ReduxProps;
const DineVedlegg = (props: MergedProps) => {
  const { relevanteVedlegg, intl } = props;

  const onChange = (event: ChangeEvent<HTMLInputElement>) =>
    props.settValgtVedleggSkalEttersendes(
      event.target.name,
      event.target.value === "off" ? true : false
    );

  let i = 0;
  return relevanteVedlegg.length > 0 ? (
    <div className="steg__rad">
      <Undertittel>
        <FormattedMessage id="dinevedlegg.tittel" />
      </Undertittel>
      <div className="dinevedlegg__ingress">
        <Normaltekst>
          <FormattedMessage id="dinevedlegg.ingress" />
        </Normaltekst>
      </div>
      <form>
        <div className="dinevedlegg__wrapper">
          <div className="dinevedlegg__header">
            <div className="dinevedlegg__tittel" />
            <div className="dinevedlegg__checkbox">Jeg sender dette nå</div>
            <div className="dinevedlegg__checkbox">Jeg sender dette senere</div>
          </div>
          {relevanteVedlegg.map(
            ({ vedlegg, pakrevd, _key, skalEttersendes }) => (
              <div key={_key} className="dinevedlegg__vedlegg">
                <div className="dinevedlegg__id">{++i}.</div>
                <div className="dinevedlegg__tittel">
                  <Element>
                    {pakrevd &&
                      intl.formatMessage({ id: "dinevedlegg.pakrevd" })}
                    <LocaleTekst tekst={vedlegg.navn} />
                  </Element>
                </div>
                <div className="dinevedlegg__checkbox">
                  <Radio
                    value="on"
                    label={<span>&nbsp;</span>}
                    name={_key}
                    onChange={onChange}
                    checked={!skalEttersendes}
                  />
                </div>
                <div className="dinevedlegg__checkbox">
                  <Radio
                    value="off"
                    label={<span>&nbsp;</span>}
                    name={_key}
                    onChange={onChange}
                    checked={skalEttersendes}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </form>
      <div className="dinevedlegg__beskrivelse">
        <Normaltekst>
          <FormattedMessage id="dinevedlegg.beskrivelse" />
        </Normaltekst>
      </div>
    </div>
  ) : null;
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  settValgtVedleggSkalEttersendes: (
    vedleggId: string,
    skalEttersendes: boolean
  ) => dispatch(settValgtVedleggSkalEttersendes(vedleggId, skalEttersendes))
});

export default medValgtSoknadsobjekt<Props & ValgtSoknad>(
  injectIntl<Props & ValgtSoknad & InjectedIntlProps>(
    connect(
      undefined,
      mapDispatchToProps
    )(DineVedlegg)
  )
);
