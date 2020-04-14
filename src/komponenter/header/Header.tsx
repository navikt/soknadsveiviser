import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Header = ({ children }: Props) => (
  <section className="header__wrapper seksjon oversikt">
    <section className="innhold__container">{children}</section>
  </section>
);

export default Header;
