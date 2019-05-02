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
  kontaktetEnhet?: Enhet;
  label: string;
  placeholder?: string;
}

interface State {
  enheter: Enhet[];
  kontaktetEnhet: Enhet;
}

export interface EnhetOption {
  value: Enhet;
  label: string;
}

type MergedProps = Props & Personalia & FieldProps<any> & InjectedIntlProps;
class VisEnheter extends React.Component<MergedProps, State> {
  state = {
    enheter: [] as Enhet[],
    kontaktetEnhet: this.props.kontaktetEnhet || ({} as Enhet)
  };

  componentDidMount = () => {
    this.props.field.value.kontaktetEnhet = "ikkeValgt";
    this.hentEnheter();
  };

  hentEnheter = () =>
    fetchEnheter().then(enheter => this.setState({ ...this.state, enheter }));

  handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const kontaktetEnhet =
      this.state.enheter
        .filter(enhet => enhet.enhetsnummer === event.currentTarget.value)
        .shift() || ({} as Enhet);

    this.props.field.value.kontaktetEnhet = kontaktetEnhet;
    this.setState({
      ...this.state,
      kontaktetEnhet: kontaktetEnhet
    });
  };

  sjekkFeil = (kontaktetEnhet: string) =>
    this.props.touched.kontaktetEnhet && kontaktetEnhet === "ikkeValgt"
      ? {
          feilmelding: this.props.intl.formatMessage({
            id: "personalia.error.enhet"
          })
        }
      : undefined;

  render() {
    const { label, field, placeholder, intl } = this.props;
    const { enheter } = this.state;
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
            feil={this.sjekkFeil(field.value.kontaktetEnhet)}
          >
            <option key="velgEnhet" value="ikkeValgt" defaultChecked>
              {intl.formatMessage({ id: "personalia.velgenhet" })}
            </option>
            {enheter.map(enhet => (
              <option key={enhet.enhetsnummer} value={enhet.enhetsnummer}>
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