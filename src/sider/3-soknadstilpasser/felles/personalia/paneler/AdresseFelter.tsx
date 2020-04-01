import React, { Component } from "react";
import { FieldProps } from "formik/dist/Field";
import { medPersonalia } from "states/providers/Personalia";
import { Adresse, Personalia } from "states/providers/Personalia";
import InnsendingsEnhetsvelger from "./InnsendingsEnhetsvelger";
import NavFrontendSpinner from "nav-frontend-spinner";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import UndertekstBold from "nav-frontend-typografi/lib/undertekst-bold";
import InputNavn from "./felter/Navn";
import InputGateAdresse from "./felter/GateAdresse";
import InputPostnummer from "./felter/Postnummer";
import InputPoststed from "./felter/Poststed";
import InputLand from "./felter/Land";
import CheckboxTidligereKontaktMedNAV from "./sjekkbokser/TidligereKontaktMedNAV";
import { finnesSpesifisertAdresse } from "utils/soknadsobjekter";
import { finnesVisEnheter, finnesTilSkanning } from "utils/soknadsobjekter";
import { ValgtSoknad } from "states/providers/ValgtSoknadsobjekt";
import { medValgtSoknadsobjekt } from "states/providers/ValgtSoknadsobjekt";
import { localeBlockTekst } from "../../../../../utils/sprak";
import { link } from "../../../../../utils/serializers";
import BlockContent from "@sanity/block-content-to-react";
import TidligereKontaktetNAVEnhetsvelger from "./TidligereKontaktetNAVEnhetsvelger";

interface State {
  tidligereKontaktMedNAV: boolean;
}

interface Props {}

type MergedProps = Props & ValgtSoknad & Personalia & FieldProps<Adresse> & InjectedIntlProps;

class AdresseFelter extends Component<MergedProps, State> {
  state = { tidligereKontaktMedNAV: false };
  toggleTidligereKontaktMedNav = () =>
    this.setState({
      tidligereKontaktMedNAV: !this.state.tidligereKontaktMedNAV
    });

  render() {
    const { intl, touched, valgtSoknadsobjekt } = this.props;
    const { tidligereKontaktMedNAV } = this.state;
    const { innsendingsmate, muligeEnheterForInnsending } = valgtSoknadsobjekt;
    const visEnheter = finnesVisEnheter(intl.locale, innsendingsmate);
    const skalTilSkanning = finnesTilSkanning(innsendingsmate);
    const skalTilSpesifisertAdresse = finnesSpesifisertAdresse(innsendingsmate);
    const skalTilValgtEnhet = !skalTilSkanning && !skalTilSpesifisertAdresse && visEnheter;

    return touched ? (
      <>
        <UndertekstBold className="litenavstand">
          <FormattedMessage id="personalia.undertekstbold.adresse" />
        </UndertekstBold>
        <div className="litenavstand">
          <InputNavn {...this.props} />
          <InputGateAdresse {...this.props} />
          <InputPostnummer {...this.props} />
          <InputPoststed {...this.props} />
          <InputLand {...this.props} />
          {!skalTilValgtEnhet && (
            <>
              <CheckboxTidligereKontaktMedNAV
                tidligereKontaktMedNAV={tidligereKontaktMedNAV}
                toggleTidligereKontaktMedNav={this.toggleTidligereKontaktMedNav}
              />
              {tidligereKontaktMedNAV && (
                <TidligereKontaktetNAVEnhetsvelger
                  label={intl.formatMessage({
                    id: "personalia.label.velgnavkontor"
                  })}
                  placeholder={intl.formatMessage({
                    id: "personalia.label.navkontor"
                  })}
                  {...this.props}
                />
              )}
            </>
          )}
          {skalTilValgtEnhet && (
            <>
              <BlockContent
                blocks={localeBlockTekst(innsendingsmate.visenheter!, intl.locale)}
                serializers={{ marks: { link } }}
              />
              <InnsendingsEnhetsvelger
                placeholder={intl.formatMessage({
                  id: "personalia.label.navkontor"
                })}
                enhetstyper={muligeEnheterForInnsending}
                {...this.props}
              />
            </>
          )}
        </div>
      </>
    ) : (
      <NavFrontendSpinner type="XL" />
    );
  }
}

export default medValgtSoknadsobjekt(medPersonalia(injectIntl(AdresseFelter)));
