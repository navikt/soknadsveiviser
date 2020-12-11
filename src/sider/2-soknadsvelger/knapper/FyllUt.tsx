import * as React from "react";
import { Soknadsobjekt } from "../../../typer/soknad";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";

interface BasicProps {
  soknadsobjekt: Soknadsobjekt;
  linkId?: string;
  messageId: string;
  className: string;
}

const NakenBasicFyllUt = (props: BasicProps & InjectedIntlProps) => {
  const { soknadsobjekt, intl } = props;
  // fyllUtUrl skal alltid finnes her
  const fyllUtUrl = soknadsobjekt.digitalinnsending?.fyllUt?.lenker[intl.locale];
  return (
    <a id={props.linkId} href={fyllUtUrl} className={props.className}>
      <FormattedMessage id={props.messageId} />
    </a>
  );
};

const BasicFyllUt = injectIntl(NakenBasicFyllUt);

interface Props {
  soknadsobjekt: Soknadsobjekt;
}

export const KnappFyllUt = (props: Props) => (
  <BasicFyllUt
    soknadsobjekt={props.soknadsobjekt}
    linkId={props.soknadsobjekt.hovedskjema.skjemanummer}
    messageId="vissoknadsobjekter.knapp.fyllut"
    className="knapp knapp--hoved"
  />
);

export const KnappFyllUtPapir = (props: Props) => <BasicFyllUt
  soknadsobjekt={props.soknadsobjekt}
  messageId="vissoknadsobjekter.fyllUt"
  className="lenke soknadsobjekt__lenke typo-normal"
/>;
