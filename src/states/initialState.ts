import { Store } from "../typer/store";
export default {
  kategorier: {
    valgtType: "Person",
    status: "LOADING"
  },
  valgtSoknad: {
    status: "LOADING"
  },
  soknader: {
    status: "LOADING"
  },
  vedlegg: {
    valgteVedlegg: []
  },
  klage: {
    skalEttersende: undefined,
    erVideresendt: undefined
  }
} as Store;
