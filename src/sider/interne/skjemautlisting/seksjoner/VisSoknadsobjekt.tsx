import React from "react";
import Element from "nav-frontend-typografi/lib/element";
import { Kategori } from "../../../../typer/kategori";
import { Underkategori } from "../../../../typer/underkategori";
import { Soknadsobjekt } from "../../../../typer/soknad";
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl";
import LocaleTekst from "../../../../komponenter/localetekst/LocaleTekst";
import { HashLink } from "react-router-hash-link";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { settValgtUnderkategori } from "../../../../states/reducers/kategorier";
import Undertekst from "nav-frontend-typografi/lib/undertekst";
import Normaltekst from "nav-frontend-typografi/lib/normaltekst";

interface Props {
  key: string;
  valgtSkjemanummer: string;
  soknadsobjekt: Soknadsobjekt;
  kategori: Kategori;
  underkategori: Underkategori;
}

interface ReduxProps {
  settValgtUnderkategori: (underkategori: Underkategori) => void;
}
const VisSoknadsobjekt = (props: Props & InjectedIntlProps & ReduxProps) => {
  const { kategori, underkategori, soknadsobjekt } = props;

  const { hovedskjema } = soknadsobjekt;
  const soknadsdialog =
    underkategori.inngangtilsoknadsdialog !== undefined &&
    underkategori.inngangtilsoknadsdialog.soknadsdialogURL;

  const lenkeTilSkjema =
    `/soknader` +
    `/nb` +
    `/${kategori.domene.toLocaleLowerCase()}` +
    `/${kategori.urlparam}` +
    `/${underkategori.urlparam}`;

  const vedleggsskjemaliste = soknadsobjekt.vedleggtilsoknad ? hentListeOverVedleggsskjemaer(
    soknadsobjekt,
    props.valgtSkjemanummer
  ) : [];
  return (
    <div
      id={hovedskjema.skjemanummer}
      key={props.key}
      className="skjemautlisting__litenmargin-overunder"
    >
      <div
        className={
          props.valgtSkjemanummer === hovedskjema.skjemanummer ? "marker" : " "
        }
      >
        <Element>
          {hovedskjema.skjemanummer + " – " + hovedskjema.navn.nb}
        </Element>
        <div className="skjemautlisting__vedlegg">
          <Normaltekst><FormattedMessage id="skjemautlisting.tilveiviser"/></Normaltekst>
          <HashLink
            smooth={true}
            className="lenke skjemautlisting__litenmargin-sidene"
            to={
              lenkeTilSkjema +
              (soknadsdialog ? "" : "/#" + hovedskjema.skjemanummer)
            }
            onClick={() => props.settValgtUnderkategori(underkategori)}
          >
            <LocaleTekst tekst={props.soknadsobjekt.navn} />
          </HashLink>
        </div>
      </div>
      {vedleggsskjemaliste.length > 1 && (
        <div className="skjemautlisting__vedlegg">
          <Normaltekst><FormattedMessage id="skjemautlisting.vedleggsskjema"/></Normaltekst>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
            }}
            className="skjemautlisting__litenmargin-sidene"
          >
            {vedleggsskjemaliste}
          </ul>
        </div>
      )}
    </div>
  );
};

const hentListeOverVedleggsskjemaer = (
  soknadsobjekt: Soknadsobjekt,
  valgtSkjemanummer: string
) => {
  return soknadsobjekt.vedleggtilsoknad
    .map(vedlegg => vedlegg.vedlegg)
    .filter(vedlegg => vedlegg.skjematilvedlegg)
    .map(vedlegg => vedlegg.skjematilvedlegg)
    .filter(skjema => skjema)
    .map(
      skjema =>
        skjema && (
          <li
            className={
              valgtSkjemanummer === skjema.skjemanummer ? "marker" : " "
            }
            id={skjema.skjemanummer}
            key={`vedlegg${soknadsobjekt.navn}${skjema.skjemanummer}`}
          >
            <Undertekst>{skjema.skjemanummer}</Undertekst>
          </li>
        )
    );
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    settValgtUnderkategori: (underkategori: Underkategori) =>
      dispatch(settValgtUnderkategori(underkategori))
  };
};

export default injectIntl<Props & InjectedIntlProps>(
  connect(mapDispatchToProps)(VisSoknadsobjekt)
);
