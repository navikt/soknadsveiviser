import { useEffect, useState } from "react";

export function useErMobil() {
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

  return erMobil;
}
