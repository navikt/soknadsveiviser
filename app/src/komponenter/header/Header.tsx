import React from "react";
import Typer from "./typer/Typer";
import SprakVelger from "./sprak/SprakVelger";
import VeilederEttersendelse from "../veileder/varianter/Ettersendelse";
import VeilederKlage from "../veileder/varianter/Klage";

interface Props {
  visTyper?: boolean;
  inngang?: string;
}

const Header = ({ visTyper, inngang }: Props) => (
  <section className="seksjon oversikt">
    <section className="filler" />
    <section className="innhold__container">
      <SprakVelger />
      {inngang === "ettersendelse" && <VeilederEttersendelse />}
      {inngang === "klage" && <VeilederKlage />}
      {visTyper && <Typer />}
    </section>
    <section className="filler" />
  </section>
);

export default Header;
