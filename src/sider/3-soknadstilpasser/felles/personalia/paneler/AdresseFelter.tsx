import React, { Component } from "react";
import { FieldProps } from "formik/dist/Field";
import {
  Adresse,
  Personalia,
  medPersonalia
} from "states/providers/Personalia";
import BrukerVelgerEnhet from "./BrukerVelgerEnhet";
import NavFrontendSpinner from "nav-frontend-spinner";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import KontaktetEnhet from "./felter/KontaktetEnhet";
import UndertekstBold from "nav-frontend-typografi/lib/undertekst-bold";
import InputNavn from "./felter/Navn";
import InputGateAdresse from "./felter/GateAdresse";
import InputPostnummer from "./felter/Postnummer";
import InputPoststed from "./felter/Poststed";
import InputLand from "./felter/Land";
import CheckboxTidligereKontaktMedNAV from "./sjekkbokser/TidligereKontaktMedNAV";
import {
  finnesVisEnheter,
  finnesTilSkanning,
  finnesSpesifisertAdresse
} from "utils/soknadsobjekter";
import {
  medValgtSoknadsobjekt,
  ValgtSoknad
} from "states/providers/ValgtSoknadsobjekt";
import ErVideresendtTilEnhet from "./ErVideresendtTilEnhet";
import { Klage, Store } from "typer/store";
import { connect } from "react-redux";

interface State {
  tidligereKontaktMedNAV: boolean;
}

interface ReduxProps {
  klage: Klage;
}

type MergedProps = ReduxProps &
  Personalia &
  ValgtSoknad &
  FieldProps<Adresse> &
  InjectedIntlProps;

class AdresseFelter extends Component<MergedProps, State> {
  state = { tidligereKontaktMedNAV: false };
  toggleTidligereKontaktMedNav = () =>
    this.setState({
      tidligereKontaktMedNAV: !this.state.tidligereKontaktMedNAV
    });

  render() {
    const { intl, touched, valgtSoknadsobjekt, klage } = this.props;
    const { tidligereKontaktMedNAV } = this.state;
    const { innsendingsmate } = valgtSoknadsobjekt;
    const visEnheter = finnesVisEnheter(intl.locale, innsendingsmate);
    const skalTilSkanning = finnesTilSkanning(innsendingsmate);
    const skalTilSpesifisertAdresse = finnesSpesifisertAdresse(innsendingsmate);
    const skalTilValgtEnhet =
      !skalTilSkanning && !skalTilSpesifisertAdresse && visEnheter;

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
                <KontaktetEnhet
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
            <BrukerVelgerEnhet
              beskrivelse={innsendingsmate.visenheter!}
              {...this.props}
            />
          )}
          {klage.erVideresendt && <ErVideresendtTilEnhet {...this.props} />}
        </div>
      </>
    ) : (
      <NavFrontendSpinner type="XL" />
    );
  }
}

const mapStateToProps = (store: Store) => ({
  klage: store.klage
});

export default injectIntl<InjectedIntlProps>(
  medValgtSoknadsobjekt<InjectedIntlProps & ValgtSoknad>(
    medPersonalia<InjectedIntlProps & ValgtSoknad & Personalia>(
      connect(mapStateToProps)(AdresseFelter)
    )
  )
);
