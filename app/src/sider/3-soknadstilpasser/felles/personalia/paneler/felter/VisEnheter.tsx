import * as React from "react";
import { Enhet } from "../../../../../../typer/enhet";
import Select from "react-select";
import { fetchEnheter } from "../../../../../../klienter/serverKlient";
import { FieldProps } from "formik";
import Normaltekst from "nav-frontend-typografi/lib/normaltekst";
import { ValueType } from "react-select/lib/types";

interface Props {
  valgtEnhet?: EnhetOption;
  label: string;
  placeholder?: string;
}

interface State {
  enheter: Enhet[];
  valgtEnhet: EnhetOption;
}

export interface EnhetOption {
  value: Enhet;
  label: string;
}

type MergedProps = Props & FieldProps<any>;
class VisEnheter extends React.Component<MergedProps, State> {
  state = {
    enheter: [] as Enhet[],
    valgtEnhet: this.props.valgtEnhet || { label: "", value: {} as Enhet }
  };

  componentDidMount = () => this.hentEnheter();

  hentEnheter = () =>
    fetchEnheter().then(enheter => this.setState({ ...this.state, enheter }));

  handleChange = (
    selectedOption: ValueType<{ value: Enhet; label: string }>
  ) => {
    this.props.field.value.valgtEnhet = selectedOption;
    this.setState({
      ...this.state,
      valgtEnhet: this.props.field.value.valgtEnhet
    });
  };

  buildOptions = () =>
    this.state.enheter.map(enhet => ({
      value: enhet,
      label: enhet.enhetsnavn + " - " + enhet.enhetsnummer
    }));

  render() {
    const options = this.buildOptions();
    const { label, field, placeholder } = this.props;
    return (
      <div className="visEnheter">
        <Normaltekst className="skjemaelement__label">{label}</Normaltekst>
        <Select
          value={field.value.valgtEnhet}
          onChange={this.handleChange}
          options={options}
          placeholder={placeholder}
        />
      </div>
    );
  }
}

export default VisEnheter;
