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
  valgtEnhet?: Enhet;
  label?: string;
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
    this.props.touched.valgtEnhet = false;
    if (selected) {
      const valgtEnhet =
        this.state.enheter
          .filter(enhet => enhet.enhetsnummer === selected.value)
          .shift() || ({} as Enhet);
      this.props.field.value.valgtEnhet = valgtEnhet;
    } else {
      this.props.field.value.valgtEnhet = undefined;
    }
  };

  render() {
    const { label, placeholder } = this.props;
    const { enheter } = this.state;
    const touched = this.props.touched.valgtEnhet;
    const valgtEnhet = this.props.field.value.valgtEnhet;
    const error = touched && !valgtEnhet;

    const customStyles = {
      control: (base: any, state: any) => ({
        ...base,
        background: error ? "#F3E3E3" : base.background,
        borderColor: error ? "#BA3A26" : base.borderColor
      })
    };

    const defaultValue = valgtEnhet
      ? enheter
          .filter(enhet => enhet.enhetsnummer === valgtEnhet.enhetsnummer)
          .map(enhet => ({
            value: enhet.enhetsnummer,
            label: enhet.enhetsnavn
          }))[0]
      : undefined;

    return (
      <div className="visEnheter">
        {label && (
          <Normaltekst className="skjemaelement__label">{label}</Normaltekst>
        )}
        {!enheter.length ? (
          <NavFrontendSpinner />
        ) : (
          <Select
            isClearable={true}
            styles={customStyles}
            onChange={this.handleChange}
            placeholder={placeholder}
            defaultValue={defaultValue}
            options={enheter.map(enhet => ({
              value: enhet.enhetsnummer,
              label: enhet.enhetsnavn
            }))}
          />
        )}
        {error && (
          <div className="skjemaelement__feilmelding">
            <FormattedMessage id="personalia.error.velgkontor" />
          </div>
        )}
      </div>
    );
  }
}

export default medPersonalia(injectIntl(VisEnheter));
