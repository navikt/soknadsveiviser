import React from "react";
import Typer from "./typer/Typer";
import SprakVelger from "./sprak/SprakVelger";
import VeilederEttersendelse from "../veileder/varianter/Ettersendelse";
import VeilederKlage from "../veileder/varianter/Klage";
import { Sidetittel } from "nav-frontend-typografi";
import { injectIntl, FormattedMessage, InjectedIntlProps } from "react-intl";

interface Props {
  visTyper?: boolean;
  inngang?: string;
}

const Header = ({ visTyper, inngang }: Props & InjectedIntlProps) => (
  <section className="header__wrapper seksjon oversikt">
    <section className="filler" />
    <section className="innhold__container">
      <SprakVelger />
      <Sidetittel className="header__tittel">
        <FormattedMessage id="sidetittel" />
      </Sidetittel>
      {inngang === "ettersendelse" && <VeilederEttersendelse />}
      {inngang === "klage" && <VeilederKlage />}
      {visTyper && <Typer />}
    </section>
    <section className="filler" />
  </section>
);

export default injectIntl(Header);
