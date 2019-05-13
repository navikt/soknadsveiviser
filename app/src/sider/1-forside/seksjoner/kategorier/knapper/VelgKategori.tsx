import * as React from "react";
import { Kategori } from "../../../../../typer/kategori";
import classNames from "classnames";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { settValgtKategori } from "../../../../../states/reducers/kategorier";
import LocaleTekst from "../../../../../komponenter/localetekst/LocaleTekst";
import { Link } from "react-router-dom";
import { withRouter, RouteComponentProps } from "react-router";

interface Props {
  kategori: Kategori;
  erValgt: boolean;
  style: React.CSSProperties;
}

interface Routes {
  inngang: string;
  sprak: string;
  personEllerBedrift: string;
  kategori: string;
}

interface ReduxProps {
  settValgtKategori: (kategori: Kategori) => void;
}

type MergedProps = Props &
  ReduxProps &
  InjectedIntlProps &
  RouteComponentProps<Routes>;

const VelgKategori = (props: MergedProps) => {
  const { personEllerBedrift, sprak, inngang } = props.match.params;
  const klageEllerEttersendelse = inngang ? `${inngang}/` : "";
  return (
    <li key={props.kategori.urlparam}>
      <Link
        to={`/soknadsveiviser/${sprak}/${klageEllerEttersendelse}${personEllerBedrift}/${
          props.kategori.urlparam
        }`}
        onClick={() => props.settValgtKategori(props.kategori)}
        className={classNames("lenke ", { valgt: props.erValgt })}
        style={props.style}
      >
        <LocaleTekst tekst={props.kategori.tittel} />
      </Link>
    </li>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  settValgtKategori: (kategori: Kategori) =>
    dispatch(settValgtKategori(kategori))
});

export default injectIntl<Props & InjectedIntlProps>(
  withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>>(
    connect(
      undefined,
      mapDispatchToProps
    )(VelgKategori)
  )
);
