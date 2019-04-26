import { Select } from "nav-frontend-skjema";
import * as React from "react";
import { SprakString } from "../../typer/sprak";
import { injectIntl, InjectedIntlProps } from "react-intl";

interface Props {
  byttSprak: (sprak: string) => void;
  sprakvalg: SprakString;
  label: string;
  valgtSprak: string;
}

class Sprakvelger extends React.PureComponent<Props & InjectedIntlProps> {
  skjemasprak = Object.entries(this.props.sprakvalg).filter(
    ([locale, verdi]) => locale !== "_type" && verdi !== ""
  );

  handleNameChange = (e: any) => {
    // kaller persist for å unngå kræsj på synthetic events
    e.persist();
    this.props.byttSprak(e.target.value);
  };

  render() {
    const muligesprak: SprakString = {
      nb: this.props.intl.formatMessage({ id: "avslutning.sprakvelger.nb" }),
      nn: this.props.intl.formatMessage({ id: "avslutning.sprakvelger.nn" }),
      en: this.props.intl.formatMessage({ id: "avslutning.sprakvelger.en" }),
      se: this.props.intl.formatMessage({ id: "avslutning.sprakvelger.se" }),
      fr: this.props.intl.formatMessage({ id: "avslutning.sprakvelger.fr" }),
      es: this.props.intl.formatMessage({ id: "avslutning.sprakvelger.es" }),
      de: this.props.intl.formatMessage({ id: "avslutning.sprakvelger.de" }),
      pl: this.props.intl.formatMessage({ id: "avslutning.sprakvelger.pl" })
    };

    const options = this.skjemasprak.map(([locale]) => (
      <option value={locale} key={locale} id={locale}>
        {muligesprak[locale]}
      </option>
    ));

    return (
      <Select
        label={this.props.label}
        onChange={e => this.handleNameChange(e)}
        value={this.props.valgtSprak}
        className="sprakvelger__select"
      >
        {options}
      </Select>
    );
  }
}

export default injectIntl(Sprakvelger);
