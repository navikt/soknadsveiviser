import * as React from "react";
import { Enhet } from "../../../../../../typer/enhet";
import { Select } from "nav-frontend-skjema";
import { fetchEnheter } from "../../../../../../klienter/serverKlient";
import { FieldProps } from "formik";
import Normaltekst from "nav-frontend-typografi/lib/normaltekst";
import { injectIntl, InjectedIntlProps } from "react-intl";
import NavFrontendSpinner from "nav-frontend-spinner";
import {
  Personalia,
  medPersonalia
} from "../../../../../../states/providers/Personalia";

interface Props {
  valgtEnhet?: Enhet;
  label: string;
  placeholder?: string;
}

interface State {
  enheter: Enhet[];
  valgtEnhet: Enhet;
}

export interface EnhetOption {
  value: Enhet;
  label: string;
}

type MergedProps = Props & Personalia & FieldProps<any> & InjectedIntlProps;
class VisEnheter extends React.Component<MergedProps, State> {
  state = {
    enheter: [] as Enhet[],
    valgtEnhet: this.props.valgtEnhet || ({} as Enhet)
  };

  componentDidMount = () => {
    this.hentEnheter();
  };

  hentEnheter = () =>
    fetchEnheter().then(enheter => this.setState({ ...this.state, enheter }));

  handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const valgtEnhet =
      this.state.enheter
        .filter(enhet => enhet.enhetsnummer === event.currentTarget.value)
        .shift() || ({} as Enhet);

    this.props.field.value.valgtEnhet = valgtEnhet;
    this.setState({
      ...this.state,
      valgtEnhet: valgtEnhet
    });
  };

  sjekkFeil = (valgtEnhet?: string) =>
    this.props.touched.valgtEnhet &&
    (!valgtEnhet || (valgtEnhet && valgtEnhet === "ikkeValgt"))
      ? {
          feilmelding: this.props.intl.formatMessage({
            id: "personalia.error.enhet"
          })
        }
      : undefined;

  render() {
    const { label, field, placeholder, intl } = this.props;
    const { enheter } = this.state;
    const { valgtEnhet } = field.value;
    return (
      <div className="visEnheter">
        <Normaltekst className="skjemaelement__label">{label}</Normaltekst>
        {!enheter.length ? (
          <NavFrontendSpinner />
        ) : (
          <Select
            label={""}
            onChange={this.handleChange}
            placeholder={placeholder}
            feil={this.sjekkFeil(valgtEnhet)}
          >
            <option
              key="velgEnhet"
              value="ikkeValgt"
              defaultChecked={!valgtEnhet}
            >
              {intl.formatMessage({ id: "personalia.velgenhet" })}
            </option>
            {enheter.map(enhet => (
              <option
                key={enhet.enhetsnummer}
                value={enhet.enhetsnummer}
                defaultChecked={
                  valgtEnhet && valgtEnhet.enhetsnummer === enhet.enhetsnummer
                }
              >
                {enhet.enhetsnavn + " - " + enhet.enhetsnummer}
              </option>
            ))}
          </Select>
        )}
      </div>
    );
  }
}

export default medPersonalia(injectIntl(VisEnheter));
