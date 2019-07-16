import React from "react";
import Undertittel from "nav-frontend-typografi/lib/undertittel";
import Undertekst from "nav-frontend-typografi/lib/undertekst";
import EkspanderbartpanelBase from "nav-frontend-ekspanderbartpanel/lib/ekspanderbartpanel-base";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { LocaleString } from "../../../typer/sprak";
import LocaleTekst from "../../../komponenter/localetekst/LocaleTekst";

interface Props {
  tittel: LocaleString;
  undertekst: string;
  ekspandertInnhold: JSX.Element;
}

const EkspanderbartSoknadsPanel = (props: Props & InjectedIntlProps) => {
  const { tittel, undertekst, ekspandertInnhold } = props;

  return (
    <EkspanderbartpanelBase
      heading={
        <div className={"ekspanderbartPanel__headingInnhold"}>
          <Undertittel>
            <LocaleTekst tekst={tittel} />
          </Undertittel>
          <Undertekst>{undertekst}</Undertekst>
        </div>
      }
    >
      {ekspandertInnhold}
    </EkspanderbartpanelBase>
  );
};

export default injectIntl(EkspanderbartSoknadsPanel);
