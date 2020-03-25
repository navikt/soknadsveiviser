import * as React from "react";
import { FieldProps } from "formik";
import { InjectedIntlProps, injectIntl } from "react-intl";
import VisEnheter from "./felter/VisEnheter";
import { Fodselsnummer, Adresse, ValgtEnhet } from "../../../../../states/providers/Personalia";
import { Enhet } from "../../../../../typer/enhet";
import { Enhetstype } from "../../../../../typer/soknad";
import { fetchEnheter } from "../../../../../klienter/serverKlient";
import { useEffect, useState } from "react";

interface Props {
  placeholder: string;
  enhetstyper?: Enhetstype[];
  label?: string
}

type MergedProps = Props & InjectedIntlProps & FieldProps<Fodselsnummer | Adresse | ValgtEnhet>;

const BrukerVelgerEnhet = (props: MergedProps) => {
  const [enheter, setEnheter] = useState([] as Enhet[]);

  const handleChange = (value: Enhet | null) => {
    if (value) {
      props.field.value.valgtEnhet = value;
    }
  };

  useEffect(() => {
    fetchEnheter(props.enhetstyper).then(enheter => setEnheter(enheter));
  }, [props.enhetstyper]);

  return (
    <VisEnheter
      label={props.label}
      handleChange={handleChange}
      placeholder={props.placeholder}
      enheter={enheter}
      {...props}
    />
  );
};

export default injectIntl(BrukerVelgerEnhet);
