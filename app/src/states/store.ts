import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducer";
import { persistStore, persistReducer } from "redux-persist";
import { composeWithDevTools } from "redux-devtools-extension/logOnlyInProduction";
import sessionStorage from "redux-persist/lib/storage/session";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage: sessionStorage,
  whitelist: ["vedlegg"]
};

const composeEnhancers = composeWithDevTools({});
const persistantReducer = persistReducer(persistConfig, rootReducer as any);

export const store = createStore(
  persistantReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export const persistor = persistStore(store);
