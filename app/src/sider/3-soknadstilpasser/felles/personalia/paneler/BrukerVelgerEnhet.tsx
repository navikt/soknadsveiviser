import * as React from "react";
import { Field, FieldProps } from "formik";
import { Normaltekst } from "nav-frontend-typografi";
import BlockContent from "@sanity/block-content-to-react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { localeBlockTekst } from "../../../../../utils/sprak";
import { link } from "../../../../../utils/serializers";
import { SprakBlockText } from "../../../../../typer/sprak";
import VisEnheter from "./felter/VisEnheter";
import { ValgtEnhet } from "../../../../../states/providers/Personalia";

interface Props {
  beskrivelse: SprakBlockText;
}

const BrukerVelgerEnhet = (props: Props & InjectedIntlProps) => {
  return (
    <>
      <BlockContent
        blocks={localeBlockTekst(props.beskrivelse, props.intl.locale)}
        serializers={{ marks: { link } }}
      />
      <Field
        name="tiltaksbedrift"
        label="Tiltaksbedrift"
        render={(pr: FieldProps<ValgtEnhet>) => (
          <>
            <VisEnheter
              label={""}
              placeholder={props.intl.formatMessage({
                id: "personalia.label.navkontor"
              })}
              {...pr}
            />
          </>
        )}
      />
    </>
  );
};

export default injectIntl(BrukerVelgerEnhet);
