import React, { useState, useEffect } from "react";
import Veilederpanel from "nav-frontend-veilederpanel";
import veileder from "../../img/veileder.svg";

interface Props {
  children: JSX.Element | JSX.Element[];
}

const Veileder = (props: Props) => {
  const [erMobil, setErMobil] = useState(window.innerWidth <= 420);

  useEffect(() => {
    window.addEventListener("resize", () =>
      setErMobil(window.innerWidth <= 420)
    );
    return () => {
      window.removeEventListener("resize", () =>
        setErMobil(window.innerWidth <= 420)
      );
    };
  });

  return (
    <Veilederpanel
      type={erMobil ? "plakat" : "normal"}
      kompakt={erMobil}
      svg={<img alt="Veileder" src={veileder} />}
    >
      {props.children}
    </Veilederpanel>
  );
};

export default Veileder;
