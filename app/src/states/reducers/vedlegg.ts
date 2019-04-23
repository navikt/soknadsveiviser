import { Store, Vedlegg } from "../../typer/store";
import { Soknadsobjekt } from "../../typer/soknad";

// Interfaces
interface AppendVedlegg {
  type: string;
  soknadsobjekt: Soknadsobjekt;
}

interface ToggleVedlegg {
  type: string;
  _key: string;
  soknadsobjektId: string;
  klage?: boolean;
}

// Actions
export const settVedlegg = (soknadsobjekt?: Soknadsobjekt) => ({
  type: "SETT_VEDLEGG",
  soknadsobjekt
});

export const toggleValgtVedlegg = (
  _key: string,
  soknadsobjektId: string,
  klage?: boolean
) => ({ type: "TOGGLE_VALGT_VEDLEGG", _key, soknadsobjektId, klage });

export const toggleValgtVedleggForEttersendelse = (
  _key: string,
  soknadsobjektId: string
) => ({
  type: "TOGGLE_VALGT_VEDLEGG_ETTERSENDELSE",
  _key,
  soknadsobjektId
});

export const toggleInnsendingVedlegg = (
  _key: string,
  soknadsobjektId: string
) => ({ type: "TOGGLE_INNSENDING_VEDLEGG", _key, soknadsobjektId });

export const nullstillVedlegg = (soknadsobjektId: string) => ({
  type: "NULLSTILL_VEDLEGG",
  soknadsobjektId
});

// Reducers
type Action = AppendVedlegg & ToggleVedlegg;
export const vedlegg = (state: Vedlegg, action: Action, root: Store) => {
  const { valgteVedlegg } = state;
  switch (action.type) {
    case "SETT_VEDLEGG": {
      const { soknadsobjekt } = action;
      if (!soknadsobjekt) {
        return state;
      }

      const { valgteVedlegg } = root.vedlegg;
      const vedlegg = soknadsobjekt.vedleggtilsoknad
        .filter(
          vedlegg =>
            // Check if already added
            !valgteVedlegg
              .filter(v => v._key === vedlegg._key)
              .filter(v => v.soknadsobjektId === soknadsobjekt._id)
              .shift()
        )
        .map(vedlegg => ({
          ...vedlegg,
          skalSendes: undefined,
          skalEttersendes: false,
          soknadsobjektId: soknadsobjekt._id
        }));

      return {
        ...state,
        valgteVedlegg: [...state.valgteVedlegg, ...vedlegg]
      };
    }

    case "TOGGLE_VALGT_VEDLEGG": {
      const { _key } = action;
      return {
        ...state,
        valgteVedlegg: valgteVedlegg.map(vedleggsobjekt =>
          vedleggsobjekt._key === _key || "ikke" + vedleggsobjekt._key === _key
            ? {
                ...vedleggsobjekt,
                skalSendes: _key === vedleggsobjekt._key,
                skalEttersendes: false
              }
            : vedleggsobjekt
        )
      };
    }

    case "TOGGLE_VALGT_VEDLEGG_ETTERSENDELSE":
      return {
        ...state,
        valgteVedlegg: valgteVedlegg.map(vedleggsobjekt =>
          vedleggsobjekt._key === action._key
            ? {
                ...vedleggsobjekt,
                skalSendes: !vedleggsobjekt.skalSendes || false
              }
            : vedleggsobjekt
        )
      };

    case "TOGGLE_INNSENDING_VEDLEGG":
      return {
        ...state,
        valgteVedlegg: valgteVedlegg.map(vedleggsobjekt =>
          vedleggsobjekt._key === action._key
            ? {
                ...vedleggsobjekt,
                skalEttersendes: !vedleggsobjekt.skalEttersendes || false
              }
            : vedleggsobjekt
        )
      };

    case "NULLSTILL_VEDLEGG":
      return {
        ...state,
        valgteVedlegg: valgteVedlegg
          .filter(vedlegg => vedlegg.soknadsobjektId === action.soknadsobjektId)
          .map(vedleggsobjekt => ({
            ...vedleggsobjekt,
            skalSendes: undefined
          }))
      };
    default:
      return state;
  }
};
