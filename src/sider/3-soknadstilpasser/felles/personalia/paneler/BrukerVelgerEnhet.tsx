import * as React from "react";
import { FieldProps } from "formik";
import BlockContent from "@sanity/block-content-to-react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { localeBlockTekst } from "../../../../../utils/sprak";
import { link } from "../../../../../utils/serializers";
import { LocaleBlockText } from "../../../../../typer/sprak";
import VisEnheter from "./felter/VisEnheter";
import {
  Fodselsnummer,
  Adresse
} from "../../../../../states/providers/Personalia";

interface Props {
  beskrivelse: LocaleBlockText;
}

type MergedProps = Props &
  InjectedIntlProps &
  FieldProps<Fodselsnummer | Adresse>;

const BrukerVelgerEnhet = (props: MergedProps) => (
  <div>
    <BlockContent
      blocks={localeBlockTekst(props.beskrivelse, props.intl.locale)}
      serializers={{ marks: { link } }}
    />
    <VisEnheter
      placeholder={props.intl.formatMessage({
        id: "personalia.label.navkontor"
      })}
      {...props}
    />
  </div>
);

export default injectIntl(BrukerVelgerEnhet);
