import React, { Component } from "react";
import { Enhet } from "../../../../../../typer/enhet";
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
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

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

  handleChange = (value: Enhet | null) => {
    this.props.touched.kontaktetEnhet = false;
    if (value) {
      this.props.field.value.kontaktetEnhet = value;
    } else {
      this.props.field.value.kontaktetEnhet = undefined;
    }
  };

  render() {
    const { label } = this.props;
    const { enheter } = this.state;
    const touched = this.props.touched.kontaktetEnhet;
    const kontaktetEnhet = this.props.field.value.kontaktetEnhet;
    const error = touched && !kontaktetEnhet;

    return (
      <div className="visEnheter">
        <Normaltekst className="skjemaelement__label">{label}</Normaltekst>
        {!enheter.length ? (
          <NavFrontendSpinner />
        ) : (
          <Autocomplete
            onChange={(event: any, value: Enhet | null) => this.handleChange(value)}
            options={enheter}
            getOptionLabel={option => option.enhetsnavn}
            renderInput={params => <TextField {...params} label="NAV-kontor" variant="outlined" />}
            autoComplete={true}
            includeInputInList
            disableClearable={true}
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
