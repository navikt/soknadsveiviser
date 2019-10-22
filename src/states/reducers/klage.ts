import { Store, Klage } from "../../typer/store";

// Interfaces
interface SettKlageEtterendelse {
  type: string;
  skalEttersende: boolean;
}
interface SettVideresendtTilEnhet {
  type: string;
  erVideresendt: boolean;
}

// Actions
export const settEttersendTilKlage = (skalEttersende: boolean) => {
  return { type: "SETT_ETTERSEND_TIL_KLAGE", skalEttersende };
};

export const settVideresendtTilEnhet = (erVideresendt?: boolean) => {
  return { type: "SETT_VIDERESENDT_TIL_ENHET", erVideresendt };
};

// Reducers
type KlageActions = SettKlageEtterendelse & SettVideresendtTilEnhet;
export const klage = (state: Klage, action: KlageActions, root: Store) => {
  switch (action.type) {
    case "SETT_ETTERSEND_TIL_KLAGE":
      return { ...state, skalEttersende: action.skalEttersende };
    case "SETT_VIDERESENDT_TIL_ENHET":
      return { ...state, erVideresendt: action.erVideresendt };
    default:
      return state;
  }
};
