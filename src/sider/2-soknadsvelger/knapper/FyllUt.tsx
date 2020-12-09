import * as React from "react";
import { Soknadsobjekt } from "../../../typer/soknad";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";

interface BasicProps {
  soknadsobjekt: Soknadsobjekt;
  linkId?: string;
  messageId: string;
  className: string;
}

export const BasicFyllUt = (props: BasicProps & InjectedIntlProps) => {
  const { soknadsobjekt, intl } = props;
  // fyllUtUrl skal alltid finnes her
  const fyllUtUrl = soknadsobjekt.digitalinnsending?.fyllUt?.lenker[intl.locale];
  return (
    <a id={props.linkId} href={fyllUtUrl} className={props.className}>
      <FormattedMessage id={props.messageId} />
    </a>
  );
};

interface Props {
  soknadsobjekt: Soknadsobjekt;
}

const NakenKnappFyllUt = (props: Props & InjectedIntlProps) => (
  <BasicFyllUt
    {...props}
    linkId={props.soknadsobjekt.hovedskjema.skjemanummer}
    messageId={"vissoknadsobjekter.knapp.fyllut"}
    className="knapp knapp--hoved"
  />
);
const WrappedFyllUt = injectIntl(NakenKnappFyllUt);

const NakenKnappFyllUtPapir = (props: Props & InjectedIntlProps) => <BasicFyllUt
  {...props}
  messageId={"vissoknadsobjekter.fyllUt"}
  className="lenke soknadsobjekt__lenke typo-normal"
/>;


const WrappedFyllUtPapir = injectIntl(NakenKnappFyllUtPapir);
export {WrappedFyllUtPapir as KnappFyllUtPapir, WrappedFyllUt as KnappFyllUt};