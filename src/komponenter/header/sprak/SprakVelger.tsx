import * as React from "react";
import languages from "./SprakVelgerData";
import sprakIcon from "../../../img/sprak.svg";
import { Kategori } from "../../../typer/kategori";
import { Underkategori } from "../../../typer/underkategori";
import { withRouter, RouteComponentProps } from "react-router";
import {
  IntlProviderWrapperContextType,
  IntlProviderWrapperHOC
} from "../../../sprak/IntlProviderWrapper";
import { Link } from "react-router-dom";

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
  const { sprak } = props.match.params;
  const onClick = (code: string) => props.context.settLocale(code);
  return (
    <div className="oversikt">
      <div className="sprakvelger__container">
        {languages.map(
          language =>
            language.code !== sprak && (
              <Link
                to={window.location.pathname.replace(sprak, language.code)}
                onClick={() => onClick(language.code)}
                className="lenke sprakvelger__lenke"
                key={language.code}
              >
                {language.language}
                <img
                  alt="Ikon til språkvelger"
                  className="sprakvelger__ikon"
                  src={sprakIcon}
                />
              </Link>
            )
        )}
      </div>
    </div>
  );
};

// @ts-ignore
export default withRouter(IntlProviderWrapperHOC(SprakVelger));
