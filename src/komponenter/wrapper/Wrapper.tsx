import React, { RefObject, createRef, useEffect } from "react";
import Hovedbanner from "../bannere/Hovedbanner";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { FetchKategorier } from "../../typer/store";
import { Store } from "../../typer/store";
import Header from "../header/Header";
import { localeTekst } from "../../utils/sprak";
import { usePrevious } from "../../utils/hooks";
import SprakVelger from "../header/sprak/SprakVelger";

interface Routes {
  sprak: string;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

interface ReduxProps {
  kategorier: FetchKategorier;
}

type MergedProps = Props & RouteComponentProps<Routes> & InjectedIntlProps & ReduxProps;

const Wrapper = (props: MergedProps) => {
  const { intl, children, match } = props;
  const mainContent: RefObject<HTMLDivElement> = createRef();
  const sprak = match.params.sprak;
  const lastState = usePrevious({ sprak });
  const hasHash = props.location.hash;
  const localeChanged = lastState && sprak !== lastState.sprak;

  useEffect(() => {
    if (!hasHash && !localeChanged) {
      window.scrollTo(0, 0);
    }
  });

  return (
    <>
      <Header>
        <SprakVelger />
      </Header>
      <div className="side__wrapper" id="maincontent" ref={mainContent}>
        <div className="innhold__container">
          {(() => {
            switch (props.kategorier.status) {
              case "RESULT": {
                const { valgtKategori, valgtUnderkategori } = props.kategorier;
                return (
                  <Hovedbanner
                    tittel={localeTekst(valgtUnderkategori.navn, intl.locale)}
                    undertittel={localeTekst(valgtKategori.tittel, intl.locale)}
                    backgroundColor={valgtKategori.domenefarge}
                    borderColor={valgtKategori.kantfarge}
                  />
                );
              }
              default:
              case "LOADING":
              case "HTTP_ERROR":
                break;
            }
          })()}
          {children}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (store: Store) => {
  return {
    kategorier: store.kategorier
  };
};

export default withRouter<Props & RouteComponentProps, any>(
  injectIntl<Props & RouteComponentProps & InjectedIntlProps>(connect(mapStateToProps)(Wrapper))
);
