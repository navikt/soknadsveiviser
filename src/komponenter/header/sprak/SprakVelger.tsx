import * as React from "react";
import languages from "./SprakVelgerData";
import { Kategori } from "../../../typer/kategori";
import { Underkategori } from "../../../typer/underkategori";
import { withRouter, RouteComponentProps, useLocation, useHistory } from "react-router";
import { IntlProviderWrapperContextType, IntlProviderWrapperHOC } from "../../../sprak/IntlProviderWrapper";
import { useEffect } from "react";
import { onLanguageSelect, setAvailableLanguages } from "@navikt/nav-dekoratoren-moduler";

interface Props {
  valgtKategori?: Kategori;
  valgtUnderkategori?: Underkategori;
}

interface Context {
  context: IntlProviderWrapperContextType;
}

interface Routes {
  sprak: string;
}

type MergedProps = Props & Context & RouteComponentProps<Routes>;
const SprakVelger = (props: MergedProps) => {
  const location = useLocation();
  const { context } = props;
  const { sprak } = props.match.params;
  const history = useHistory();

  onLanguageSelect((language) => {
    context.settLocale(language.locale);
    history.push(language.url!);
  });

  useEffect(() => {
    setAvailableLanguages(
      // @ts-ignore
      languages.map((lang) => ({
        locale: lang.code,
        url: window.location.pathname.replace(sprak, lang.code),
        handleInApp: true,
      }))
    );
  }, [location.pathname, sprak]);

  return <></>;
};

// @ts-ignore
export default withRouter(IntlProviderWrapperHOC(SprakVelger));
