import * as React from "react";
import { FieldProps } from "formik";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { FormattedMessage } from "react-intl";
import VisEnheter from "./felter/VisEnheter";

type MergedProps = InjectedIntlProps & FieldProps<any>;
const ErVideresendtTilEnhet = (props: MergedProps) => (
  <div>
    <FormattedMessage id={"klage.velg.behanlende.enhet"} />
    <VisEnheter
      placeholder={props.intl.formatMessage({
        id: "personalia.label.navkontor"
      })}
      {...props}
    />
  </div>
);

export default injectIntl(ErVideresendtTilEnhet);
