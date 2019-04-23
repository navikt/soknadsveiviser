import React, { Component } from "react";
import { FieldProps } from "formik/dist/Field";
import {
  Adresse,
  PersonaliaKontekst
} from "../../../../../states/providers/Personalia";
import NavFrontendSpinner from "nav-frontend-spinner";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import VisEnheter from "./felter/VisEnheter";
import UndertekstBold from "nav-frontend-typografi/lib/undertekst-bold";
import InputNavn from "./felter/Navn";
import InputGateAdresse from "./felter/GateAdresse";
import InputPostnummer from "./felter/Postnummer";
import InputPoststed from "./felter/Poststed";
import InputLand from "./felter/Land";
import CheckboxTidligereKontaktMedNAV from "./sjekkbokser/TidligereKontaktMedNAV";

interface Props {
  context: PersonaliaKontekst;
}

interface State {
  tidligereKontaktMedNAV: boolean;
}

type MergedProps = Props & FieldProps<Adresse> & InjectedIntlProps;
class AdresseFelter extends Component<MergedProps, State> {
  state = { tidligereKontaktMedNAV: false };
  toggleTidligereKontaktMedNav = () =>
    this.setState({
      tidligereKontaktMedNAV: !this.state.tidligereKontaktMedNAV
    });

  render() {
    const { context, intl } = this.props;
    const { tidligereKontaktMedNAV } = this.state;
    const { touched } = context;
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
          <CheckboxTidligereKontaktMedNAV
            tidligereKontaktMedNAV={tidligereKontaktMedNAV}
            toggleTidligereKontaktMedNav={this.toggleTidligereKontaktMedNav}
          />
          {tidligereKontaktMedNAV && (
            <VisEnheter
              label={intl.formatMessage({
                id: "personalia.label.velgnavkontor"
              })}
              placeholder={intl.formatMessage({
                id: "personalia.label.navkontor"
              })}
              {...this.props}
            />
          )}
        </div>
      </>
    ) : (
      <NavFrontendSpinner type="XL" />
    );
  }
}

export default injectIntl(AdresseFelter);
