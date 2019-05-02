import { Store, Klage } from "../../typer/store";

//Interfaces
interface SettKlageEtterendelse {
  type: string;
  skalEttersende: boolean;
}

// Actions
export const settEttersendTilKlage = (skalEttersende: boolean) => {
  return { type: "SETT_ETTERSEND_TIL_KLAGE", skalEttersende };
};

// Reducers
type SoknaderActions = SettKlageEtterendelse;
export const klage = (state: Klage, action: SoknaderActions, root: Store) => {
  switch (action.type) {
    case "SETT_ETTERSEND_TIL_KLAGE":
      return { ...state, skalEttersende: action.skalEttersende };
    default:
      return state;
  }
};
