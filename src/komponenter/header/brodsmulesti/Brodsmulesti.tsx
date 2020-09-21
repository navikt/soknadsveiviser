import React, { ReactNode, useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { onBreadcrumbClick } from "@navikt/nav-dekoratoren-moduler/dist";

export interface Smule {
  tekst: ReactNode;
  lenke: string;
}

export const Brodsmulesti = (props: { listeOverSmuler: Smule[] }) => {
  const location = useLocation();
  const history = useHistory();
  const { listeOverSmuler } = props;

  onBreadcrumbClick((breadcrumb) => {
    history.push(breadcrumb.url);
  });

  useEffect(() => {
    setBreadcrumbs(
      listeOverSmuler.map((smule) => ({
        title: smule.tekst as string,
        url: smule.lenke,
        handleInApp: true,
      }))
    );
  }, [location, listeOverSmuler]);

  return <></>;
};
