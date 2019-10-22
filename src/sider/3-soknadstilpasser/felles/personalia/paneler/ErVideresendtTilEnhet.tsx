import * as React from "react";
import { FieldProps } from "formik";
import { InjectedIntlProps, injectIntl } from "react-intl";
import VisEnheter from "./felter/VisEnheter";

type MergedProps = InjectedIntlProps & FieldProps<any>;
const ErVideresendtTilEnhet = (props: MergedProps) => (
  <VisEnheter
    label={props.intl.formatMessage({
      id: "klage.velg.behanlende.enhet"
    })}
    placeholder={props.intl.formatMessage({
      id: "personalia.label.navkontor"
    })}
    {...props}
  />
);

export default injectIntl(ErVideresendtTilEnhet);
