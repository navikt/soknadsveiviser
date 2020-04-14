import React from "react";
import Veilederpanel from "nav-frontend-veilederpanel";
import veileder from "../../img/veileder.svg";
import { useErMobil } from "../../utils/useErMobil";

interface Props {
  children: JSX.Element | JSX.Element[];
  className?: string
}

const Veileder = (props: Props) => {
  const erMobil = useErMobil();

  return (
    <div className={props.className}>
      <Veilederpanel
        type={erMobil ? "plakat" : "normal"}
        kompakt={erMobil}
        svg={<img alt="Veileder" src={veileder} />}
      >
        {props.children}
      </Veilederpanel>
    </div>
  );
};

export default Veileder;
