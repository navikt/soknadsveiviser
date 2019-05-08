import * as React from "react";
import { Vedleggsobjekt } from "../../../typer/vedlegg";
import { Normaltekst, Undertittel, Element } from "nav-frontend-typografi";
import LocaleTekst from "../../../komponenter/localetekst/LocaleTekst";
import { toggleInnsendingVedlegg } from "../../../states/reducers/vedlegg";
import {
  medValgtSoknadsobjekt,
  ValgtSoknad
} from "../../../states/providers/ValgtSoknadsobjekt";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Dispatch } from "redux";

interface Props {
  relevanteVedlegg: Vedleggsobjekt[];
}

type MergedProps = Props & ValgtSoknad & InjectedIntlProps;
const DineVedlegg = (props: MergedProps) => {
  const { relevanteVedlegg, intl } = props;

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
      <div className="dinevedlegg__vedlegg">
        <ol>
          {relevanteVedlegg.map(({ vedlegg, pakrevd, _key }) => (
            <li key={_key}>
              <Element>
                {pakrevd && intl.formatMessage({ id: "dinevedlegg.pakrevd" })}
                <LocaleTekst tekst={vedlegg.navn} />
              </Element>
            </li>
          ))}
        </ol>
      </div>
      <div className="dinevedlegg__beskrivelse">
        <Normaltekst>
          <FormattedMessage id="dinevedlegg.beskrivelse" />
        </Normaltekst>
      </div>
    </div>
  ) : null;
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  toggleInnsendingVedlegg: (vedleggId: string, soknadsobjektId: string) =>
    dispatch(toggleInnsendingVedlegg(vedleggId, soknadsobjektId))
});

export default medValgtSoknadsobjekt<Props & ValgtSoknad>(
  injectIntl<Props & ValgtSoknad & InjectedIntlProps>(
    connect(
      undefined,
      mapDispatchToProps
    )(DineVedlegg)
  )
);
