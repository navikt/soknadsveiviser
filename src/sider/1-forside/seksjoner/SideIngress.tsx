import React, { ReactNode } from "react";
import VeilederEttersendelse from "../../../komponenter/veileder/varianter/VeilederEttersendelse";
import VeilederKlage from "../../../komponenter/veileder/varianter/VeilederKlage";
import { Ingress } from "nav-frontend-typografi";
import { FormattedMessage } from "react-intl";

export const SideIngress = (props: { inngang: string }) => (
  <div className="header__ingress">{ingressElement[props.inngang] || ingressElement.default}</div>
);

const ingressElement: { [index: string]: ReactNode } = {
  ettersendelse: <VeilederEttersendelse className="header__ingress--veileder" />,
  klage: <VeilederKlage className="header__ingress--veileder"/>,
  default: (
    <Ingress className="header__ingress--tekst">
      <FormattedMessage id="sideingress" />
    </Ingress>
  )
};
