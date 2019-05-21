import React from "react";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { LocaleString } from "../../typer/sprak";

interface Props {
  tekst: LocaleString;
}

const SprakTekst = (props: Props & InjectedIntlProps) => (
  <>
    {props.tekst
      ? // Vis teksten på norsk dersom ønsket locale ikke er tilgjengelig
        props.tekst[props.intl.locale] ||
        props.tekst.nb || (
          <span style={{ color: "red" }}>
            {props.intl.formatMessage({ id: "feil.ingentekst" })}
          </span>
        )
      : props.intl.formatMessage({ id: "feil.udefinerttekst" })}
  </>
);

export default injectIntl(SprakTekst);
