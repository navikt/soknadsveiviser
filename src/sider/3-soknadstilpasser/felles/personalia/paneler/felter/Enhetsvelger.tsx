import React, { Component } from "react";
import { Enhet } from "../../../../../../typer/enhet";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { FieldProps } from "formik";
import { Label } from "nav-frontend-skjema";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { Personalia, medPersonalia } from "../../../../../../states/providers/Personalia";
import { FormattedMessage } from "react-intl";
import { TextField } from "@material-ui/core";

interface Props {
  label?: string;
  placeholder: string;
  field: any;
  handleChange: (value: Enhet | null) => void;
  enheter: Enhet[];
}

type MergedProps = Props & Personalia & FieldProps & InjectedIntlProps;
class Enhetsvelger extends Component<MergedProps> {
  render() {
    const { label, enheter } = this.props;
    const touched = this.props.touched.valgtEnhet;
    const valgtEnhet = this.props.field.value.valgtEnhet;
    const error = touched && !valgtEnhet;

    return (
      <div className="visEnheter">
        <Label htmlFor="autocomplete" className="skjemaelement__label">{label}</Label>
        <Autocomplete
          id="autocomplete"
          className="autocomplete"
          onChange={(event: any, value: Enhet | null) => this.props.handleChange(value)}
          options={enheter}
          getOptionLabel={option => option.enhetsnavn}
          renderInput={params => <TextField {...params} label={this.props.placeholder} variant="outlined" />}
          autoComplete={true}
          includeInputInList
          disableClearable={true}
        />
        {error && (
          <div className="skjemaelement__feilmelding typo-feilmelding">
            <FormattedMessage id="personalia.error.velgkontor" />
          </div>
        )}
      </div>
    );
  }
}

export default medPersonalia(injectIntl(Enhetsvelger));
