import React, { Component, ComponentType } from "react";
import { EnhetOption } from "../../sider/3-soknadstilpasser/felles/personalia/paneler/felter/VisEnheter";

export interface Adresse {
  navn: string;
  adresse: string;
  postnummer?: string;
  sted: string;
  land?: string;
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
  valgtEnhet: boolean;
}

export interface State {
  fodselsnummer: string;
  adresse: Adresse;
  touched: IsTouched;
  bedrift: ValgtEnhet;
}

export interface PersonaliaKontekst extends State {
  resetState(): void;
  settFodselsnummer(fodselsnummer: string): void;
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
  fodselsnummer: "" as string,
  adresse: {} as Adresse,
  touched: {} as IsTouched,
  bedrift: {} as ValgtEnhet
};

const initKontekst = {
  ...initState,
  resetState: () => {}, // tslint:disable-line:no-empty
  settFodselsnummer: () => {}, // tslint:disable-line:no-empty
  settAdresse: () => {}, // tslint:disable-line:no-empty
  settTouched: () => {}, // tslint:disable-line:no-empty
  settValgtEnhet: () => {} // tslint:disable-line:no-empty
};

export const PersonaliaKontekst = React.createContext<PersonaliaKontekst>(
  initKontekst
);

class MedPersonalia extends Component<{}, State> {
  state = initState;
  resetState = () => this.setState(initState);

  settFodselsnummer = (fodselsnummer: string) =>
    this.setState({ fodselsnummer });

  settAdresse = (adresse: Adresse) => this.setState({ adresse });

  settTouched = (touched: IsTouched) =>
    this.setState({ ...this.state, touched });

  settValgtEnhet = (
    valgtEnhet: EnhetOption,
    flerePersonerEllerTiltaksbedrift:
      | "flerepersoner"
      | "tiltaksbedrift"
      | undefined
  ) =>
    this.setState({
      ...this.state,
      bedrift: { valgtEnhet, flerePersonerEllerTiltaksbedrift }
    });

  render() {
    const context: PersonaliaKontekst = {
      ...this.state,
      resetState: this.resetState,
      settFodselsnummer: this.settFodselsnummer,
      settAdresse: this.settAdresse,
      settTouched: this.settTouched,
      settValgtEnhet: this.settValgtEnhet
    };
    return (
      <PersonaliaKontekst.Provider value={context}>
        {this.props.children}
      </PersonaliaKontekst.Provider>
    );
  }
}

export function medPersonalia<PROPS>(
  Component: ComponentType<PROPS & { personaliaKontekst: PersonaliaKontekst }>
): ComponentType<PROPS> {
  return (props: PROPS) => (
    <PersonaliaKontekst.Consumer>
      {personaliaKontekst => (
        <Component personaliaKontekst={personaliaKontekst} {...props} />
      )}
    </PersonaliaKontekst.Consumer>
  );
}

export default MedPersonalia;
