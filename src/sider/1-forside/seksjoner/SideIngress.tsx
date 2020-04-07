import React, { ReactNode } from "react";
import VeilederEttersendelse from "../../../komponenter/veileder/varianter/VeilederEttersendelse";
import VeilederKlage from "../../../komponenter/veileder/varianter/VeilederKlage";
import { Ingress } from "nav-frontend-typografi";
import { FormattedMessage } from "react-intl";

export const SideIngress = (props: { inngang: string }) => (
  <>{ingressElement[props.inngang] || ingressElement.default}</>
);

const ingressElement: { [index: string]: ReactNode } = {
  ettersendelse: <VeilederEttersendelse />,
  klage: <VeilederKlage />,
  default: (
    <Ingress>
      <FormattedMessage id="sideingress" />
    </Ingress>
  )
};
