import React, { Component, ComponentType } from "react";
import { Enhet } from "../../typer/enhet";

export interface Fodselsnummer {
  fodselsnummer: string;
  valgtEnhet?: Enhet;
}

export interface Adresse {
  navn: string;
  adresse: string;
  postnummer?: string;
  sted: string;
  land?: string;
  kontaktetEnhet?: Enhet;
  valgtEnhet?: Enhet;
}

export interface ValgtEnhet {
  valgtEnhet: Enhet;
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

export interface PersonaliaState {
  fodselsnummer: Fodselsnummer;
  adresse: Adresse;
  touched: IsTouched;
  bedrift: ValgtEnhet;
}

export interface Personalia extends PersonaliaState {
  resetState(): void;
  settFodselsnummer(fodselsnummer: Fodselsnummer): void;
  settAdresse(adresse: Adresse): void;
  settValgtEnhet(
    valgtEnhet: Enhet,
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
  touched: {} as IsTouched,
  bedrift: {} as ValgtEnhet
};

const { Provider, Consumer } = React.createContext<Personalia | null>(null);

class MedPersonalia extends Component<{}, PersonaliaState> {
  state = initState;
  resetState = () => this.setState(initState);

  settFodselsnummer = (fodselsnummer: Fodselsnummer) =>
    this.setState({ fodselsnummer });

  settAdresse = (adresse: Adresse) => this.setState({ adresse });

  settTouched = (touched: IsTouched) =>
    this.setState({ ...this.state, touched });

  settValgtEnhet = (
    valgtEnhet: Enhet,
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
