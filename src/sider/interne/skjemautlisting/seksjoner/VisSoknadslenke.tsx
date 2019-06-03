import { Soknadslenke } from "../../../../typer/soknad";
import { Element } from "nav-frontend-typografi";
import React from "react";

export const VisSoknadslenke = (props: {soknadslenke: Soknadslenke}) => (
  <div
    id={props.soknadslenke.navn.nb}
    key={props.soknadslenke._id}
    className="skjemautlisting__litenmargin-overunder"
  >
    <Element>{props.soknadslenke.navn.nb}</Element>
    <a
      href={props.soknadslenke.lenke.lenke.nb}
      className="lenke"
    >
      {props.soknadslenke.lenke.tekst.nb}
    </a>
  </div>
);
