import { getApplicableSkjemaoversiktRedirect } from "./redirects";
import Spinner from "../komponenter/spinner/Spinner";
import React from "react";
import { AllRoutes } from "./MedSkjemaoversiktRedirects";

type Props = {
  params: AllRoutes;
};

export const RedirectTilSkjemaoversikt = ({ params }: Props) => {
  const redirectUrl = getApplicableSkjemaoversiktRedirect(params);

  window.location.replace(redirectUrl);

  return <Spinner />;
};
