import React, { Component, ComponentType } from "react";
import { EnhetOption } from "../../sider/3-soknadstilpasser/felles/personalia/paneler/felter/VisEnheter";

export interface Fodselsnummer {
  fodselsnummer: string;
  valgtEnhet?: EnhetOption;
}

export interface Adresse {
  navn: string;
  adresse: string;
  postnummer?: string;
  sted: string;
  land?: string;
  kontaktetEnhet?: EnhetOption;
  valgtEnhet?: EnhetOption;
}

export interface ValgtEnhet {
  valgtEnhet: EnhetOption;
  flerePersonerEllerTiltaksbedrift?: "flerepersoner" | "tiltaksbedrift";
}

export interface IsTouched {
  fodselsnummer: boolean;
  navn: boolean;
  adresse: boolean;
  sted: boolean;
  land: boolean;
  kontaktetEnhet: boolean;
  valgtEnhet: boolean;
}

export interface State {
  fodselsnummer: Fodselsnummer;
  adresse: Adresse;
  touched: IsTouched;
  bedrift: ValgtEnhet;
}

export interface Personalia extends State {
  resetState(): void;
  settFodselsnummer(fodselsnummer: Fodselsnummer): void;
  settAdresse(adresse: Adresse): void;
  settValgtEnhet(
    valgtEnhet: EnhetOption,
    flerePersonerEllerTiltaksbedrift:
      | "flerepersoner"
      | "tiltaksbedrift"
      | undefined
  ): void;
  settTouched(touched: IsTouched): void;
}

const initState = {
  fodselsnummer: {} as Fodselsnummer,
  adresse: {} as Adresse,
  brukervelgerenhet: {} as Adresse,
  touched: {} as IsTouched,
  bedrift: {} as ValgtEnhet
};

const { Provider, Consumer } = React.createContext<Personalia | null>(null);

class MedPersonalia extends Component<{}, State> {
  state = initState;
  resetState = () => this.setState(initState);

  settFodselsnummer = (fodselsnummer: Fodselsnummer) =>
    this.setState({ fodselsnummer });

  settAdresse = (adresse: Adresse) => this.setState({ adresse });

  settTouched = (touched: IsTouched) =>
    this.setState({ ...this.state, touched });

  settValgtEnhet = (
    valgtEnhet: EnhetOption,
    flerePersonerEllerTiltaksbedrift?: "flerepersoner" | "tiltaksbedrift"
  ) =>
    this.setState({
      ...this.state,
      bedrift: { valgtEnhet, flerePersonerEllerTiltaksbedrift }
    });

  render() {
    const context = {
      ...this.state,
      resetState: this.resetState,
      settFodselsnummer: this.settFodselsnummer,
      settAdresse: this.settAdresse,
      settTouched: this.settTouched,
      settValgtEnhet: this.settValgtEnhet
    };
    return <Provider value={context}>{this.props.children}</Provider>;
  }
}

export const medPersonalia = <P extends Personalia>(
  Component: ComponentType<P>
) => (props: Pick<P, Exclude<keyof P, keyof Personalia>>) => (
  <Consumer>
    {value => <Component {...value as Personalia} {...props as P} />}
  </Consumer>
);

export default MedPersonalia;
