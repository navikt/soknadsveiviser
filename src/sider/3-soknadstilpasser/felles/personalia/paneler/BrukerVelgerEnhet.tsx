import * as React from "react";
import { FieldProps } from "formik";
import BlockContent from "@sanity/block-content-to-react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { localeBlockTekst } from "../../../../../utils/sprak";
import { link } from "../../../../../utils/serializers";
import { LocaleBlockText } from "../../../../../typer/sprak";
import VisEnheter from "./felter/VisEnheter";
import { Fodselsnummer, Adresse } from "../../../../../states/providers/Personalia";
import { Enhet } from "../../../../../typer/enhet";

interface Props {
  beskrivelse: LocaleBlockText;
}

type MergedProps = Props & InjectedIntlProps & FieldProps<Fodselsnummer | Adresse>;

const BrukerVelgerEnhet = (props: MergedProps) => {
  const handleChange = (value: Enhet | null) => {
    if (value) {
      props.field.value.valgtEnhet = value;
    }
  };

  return (
    <div>
      <BlockContent blocks={localeBlockTekst(props.beskrivelse, props.intl.locale)} serializers={{ marks: { link } }} />
      <VisEnheter
        handleChange={handleChange}
        placeholder={props.intl.formatMessage({
          id: "personalia.label.navkontor"
        })}
        {...props}
      />
    </div>
  );
};

export default injectIntl(BrukerVelgerEnhet);
