import React, { ReactNode } from "react";
import ikon from "../../../img/home.svg";
import { Normaltekst, Element } from "nav-frontend-typografi";
import Lenke from "nav-frontend-lenker";
import { HoyreChevron, VenstreChevron } from "nav-frontend-chevron";

interface Smule {
  tekst: ReactNode;
  lenke: string;
}

export const Brodsmulesti = (props: { listeOverSmuler: Smule[] }) => {
  const erMobil = window.innerWidth <= 420;

  return (
    <div className="brodsmulesti__container">
      {erMobil ? (
        <BrodsmulestiMobil forrigeSmule={props.listeOverSmuler[props.listeOverSmuler.length - 2]} />
      ) : (
        <BrodsmulestiDesktop listeOverSmuler={props.listeOverSmuler} />
      )}
    </div>
  );
};

const BrodsmulestiDesktop = (props: { listeOverSmuler: Smule[] }) => {
  const currentSmule = props.listeOverSmuler.pop();
  return (
    <>
      <img src={ikon} alt="" />
      {props.listeOverSmuler.map(smule => (
        <>
          <Lenke key={smule.lenke} href={smule.lenke}>
            <Normaltekst>{smule.tekst}</Normaltekst>
          </Lenke>
          <HoyreChevron />
        </>
      ))}
      <Element>{currentSmule?.tekst}</Element>
    </>
  );
};

const BrodsmulestiMobil = (props: { forrigeSmule: Smule }) => (
  <>
    <VenstreChevron />
    <Lenke href={props.forrigeSmule.lenke}>
      <Normaltekst>{props.forrigeSmule.tekst}</Normaltekst>
    </Lenke>
  </>
);

export const NAVSmule = {
  lenke: "https://www.nav.no",
  tekst: <span>nav.no</span>
};