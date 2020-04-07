import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Header = ({ children }: Props) => (
  <section className="header__wrapper seksjon oversikt">
    <section className="filler" />
    <section className="innhold__container">{children}</section>
    <section className="filler" />
  </section>
);

export default Header;
