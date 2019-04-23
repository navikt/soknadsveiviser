import { Store } from "../typer/store";
import { kategorier } from "./reducers/kategorier";
import { soknader } from "./reducers/soknader";
import { valgtSoknad } from "./reducers/valgtSoknad";
import { vedlegg } from "./reducers/vedlegg";
import initialState from "./initialState";

export default (state: Store = initialState, action: any) => {
  return {
    kategorier: kategorier(state.kategorier, action, state),
    soknader: soknader(state.soknader, action, state),
    valgtSoknad: valgtSoknad(state.valgtSoknad, action, state),
    vedlegg: vedlegg(state.vedlegg, action, state)
  };
};
