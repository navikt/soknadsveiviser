import * as React from "react";
import Element from "nav-frontend-typografi/lib/element";
import { Lenkeobjekt } from "../../../typer/soknad";
import { Normaltekst } from "nav-frontend-typografi";
import { FormattedMessage, injectIntl } from "react-intl";

export const RelevantInformasjon = (props: {
  lenker: Lenkeobjekt[];
  locale: string;
}) => (
  <div className="soknadsobjekt__relevant-info">
    <Element>
      <FormattedMessage id="vissoknadsobjekter.relevantinformasjon" />
    </Element>
    <ul className="soknadsobjekt__lenkeliste">
      {props.lenker.map(lenke => (
        <li
          key={lenke.tekst[props.locale]}
          className="soknadsobjekt__lenkeliste-element"
        >
          <Normaltekst>
            <a
              className="lenke lenke--frittstaende"
              href={lenke.lenke[props.locale] || ""}
            >
              {lenke.tekst[props.locale]}
            </a>
          </Normaltekst>
        </li>
      ))}
    </ul>
  </div>
);

export default injectIntl(RelevantInformasjon);
