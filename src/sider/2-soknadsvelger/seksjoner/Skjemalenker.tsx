import React, { FunctionComponent } from "react";
import { Element } from "nav-frontend-typografi";
import { FormattedMessage } from "react-intl";
import { PDFObjekt } from "../../../typer/pdf";
import { Link } from "react-router-dom";
import { LocalePDFObjekt } from "../../../typer/sprak";

export const Skjemalenkeliste: FunctionComponent<{
  pdf: LocalePDFObjekt | undefined;
  skjemanummer: string;
}> = ({ pdf, skjemanummer, children }) => {
  return pdf && skjemanummer ? (
    <div className="knapper-wrapper">
      <Element>
        <FormattedMessage id="skjemalenke.lastned" />
      </Element>
      <div>
        <span>| </span>
        {children}
      </div>
    </div>
  ) : null;
};

export const Fillenke = (props: {
  languageKey: string;
  file: PDFObjekt | undefined;
  skjemanummer: string | undefined;
}) => {
  return (
    <span>
      <Link
        className="lenke"
        to={`/soknader/${props.languageKey}/nedlasting/${props.skjemanummer}`}
      >
        {props.languageKey.toLocaleUpperCase()}
      </Link>
      <span>{`  |  `}</span>
    </span>
  );
};
