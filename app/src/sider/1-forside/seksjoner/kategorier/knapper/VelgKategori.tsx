import * as React from "react";
import { Kategori } from "../../../../../typer/kategori";
import classNames from "classnames";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { settValgtKategori } from "../../../../../states/reducers/kategorier";
import LocaleTekst from "../../../../../komponenter/localetekst/LocaleTekst";

interface Props {
  kategori: Kategori;
  erValgt: boolean;
  style: React.CSSProperties;
}

interface ReduxProps {
  settValgtKategori: (kategori: Kategori) => void;
}

type MergedProps = Props & ReduxProps & InjectedIntlProps;
const VelgKategori = (props: MergedProps) => {
  return (
    <li key={props.kategori.urlparam}>
      <button
        onClick={() => props.settValgtKategori(props.kategori)}
        className={classNames("lenke ", { valgt: props.erValgt })}
        style={props.style}
      >
        <LocaleTekst tekst={props.kategori.tittel} />
      </button>
    </li>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  settValgtKategori: (kategori: Kategori) =>
    dispatch(settValgtKategori(kategori))
});

export default injectIntl<Props & InjectedIntlProps>(
  connect(
    undefined,
    mapDispatchToProps
  )(VelgKategori)
);
