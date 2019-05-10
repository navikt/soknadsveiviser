import React, { Component } from "react";
import { Enhet } from "../../../../../../typer/enhet";
import Select from "react-select";
import { fetchEnheter } from "../../../../../../klienter/serverKlient";
import { FieldProps } from "formik";
import Normaltekst from "nav-frontend-typografi/lib/normaltekst";
import { injectIntl, InjectedIntlProps } from "react-intl";
import NavFrontendSpinner from "nav-frontend-spinner";
import {
  Personalia,
  medPersonalia
} from "../../../../../../states/providers/Personalia";
import { FormattedMessage } from "react-intl";

interface Props {
  kontaktetEnhet?: Enhet;
  label: string;
  placeholder?: string;
  field: any;
}

interface State {
  enheter: Enhet[];
}

export interface EnhetOption {
  value: Enhet;
  label: string;
}

type MergedProps = Props & Personalia & FieldProps<any> & InjectedIntlProps;
class VisEnheter extends Component<MergedProps, State> {
  state = {
    enheter: [] as Enhet[]
  };

  componentDidMount = () => {
    this.hentEnheter();
  };

  hentEnheter = () =>
    fetchEnheter().then(enheter => this.setState({ ...this.state, enheter }));

  handleChange = (selected: any) => {
    const kontaktetEnhet =
      this.state.enheter
        .filter(enhet => enhet.enhetsnummer === selected.value)
        .shift() || ({} as Enhet);

    this.props.touched.kontaktetEnhet = false;
    this.props.field.value.kontaktetEnhet = kontaktetEnhet;
  };

  render() {
    const { label, placeholder } = this.props;
    const { enheter } = this.state;
    const touched = this.props.touched.kontaktetEnhet;
    const kontaktetEnhet = this.props.field.value.kontaktetEnhet;
    const error = touched && !kontaktetEnhet;

    const customStyles = {
      control: (base: any, state: any) => ({
        ...base,
        background: error ? "#F3E3E3" : base.background,
        borderColor: error ? "#BA3A26" : base.borderColor
      })
    };

    const defaultValue = kontaktetEnhet
      ? enheter
          .filter(enhet => enhet.enhetsnummer === kontaktetEnhet.enhetsnummer)
          .map(enhet => ({
            value: enhet.enhetsnummer,
            label: `${enhet.enhetsnavn} - ${enhet.enhetsnummer}`
          }))[0]
      : undefined;

    return (
      <div className="visEnheter">
        <Normaltekst className="skjemaelement__label">{label}</Normaltekst>
        {!enheter.length ? (
          <NavFrontendSpinner />
        ) : (
          <Select
            styles={customStyles}
            onChange={this.handleChange}
            placeholder={placeholder}
            defaultValue={defaultValue}
            options={enheter.map(enhet => ({
              value: enhet.enhetsnummer,
              label: `${enhet.enhetsnavn} - ${enhet.enhetsnummer}`
            }))}
          />
        )}
        {error && (
          <div className="skjemaelement__feilmelding">
            <FormattedMessage id="personalia.error.enhet" />
          </div>
        )}
      </div>
    );
  }
}

export default medPersonalia(injectIntl(VisEnheter));
