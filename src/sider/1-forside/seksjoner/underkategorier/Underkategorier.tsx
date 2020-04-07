import * as React from "react";
import { Kategori } from "../../../../typer/kategori";
import { Underkategori } from "../../../../typer/underkategori";
import { Store } from "../../../../typer/store";
import { connect } from "react-redux";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { withRouter, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import LocaleTekst from "../../../../komponenter/localetekst/LocaleTekst";
import { Dispatch } from "redux";
import { settValgtUnderkategori } from "../../../../states/reducers/kategorier";

interface Routes {
  sprak: string;
  personEllerBedrift: string;
}
interface Props {
  valgtKategori: Kategori;
}

interface ReduxProps {
  valgtType: string;
  settValgtUnderkategori: (underkategori: Underkategori) => void;
}

type MergedProps = Props &
  InjectedIntlProps &
  RouteComponentProps<Routes> &
  ReduxProps;

const Underkategorier = (props: MergedProps) => {
  const { valgtKategori, intl, match } = props;
  const { underkategorier } = valgtKategori;

  return (
    <div className="underkategori" key={valgtKategori.tittel[intl.locale]}>
      <ul>
        {sorterteUnderkategorier(underkategorier, intl.locale).map(
          underkategori => (
            <li key={underkategori.urlparam}>
              <Link
                onClick={() => props.settValgtUnderkategori(underkategori)}
                to={
                  `/soknader` +
                  `/${match.params.sprak}` +
                  `/${match.params.personEllerBedrift}` +
                  `/${valgtKategori.urlparam}` +
                  `/${underkategori.urlparam}`
                }
                className="lenke"
              >
                <LocaleTekst tekst={underkategori.navn} />
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

const sorterteUnderkategorier = (
  underkategorier: Underkategori[],
  locale: string
): Underkategori[] =>
  underkategorier.sort(function(a: Underkategori, b: Underkategori) {
    if ((a.navn[locale] || "|") > (b.navn[locale] || "|")) {
      return 1;
    } else {
      return -1;
    }
  });

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    settValgtUnderkategori: (underkategori: Underkategori) =>
      dispatch(settValgtUnderkategori(underkategori))
  };
};

const mapStateToProps = (store: Store) => {
  return {
    valgtType: store.kategorier.valgtType
  };
};

export default withRouter<Props & RouteComponentProps<Routes>, any>(
  injectIntl<Props & RouteComponentProps<Routes> & InjectedIntlProps>(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Underkategorier)
  )
);
