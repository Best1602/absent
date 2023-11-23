import React from "react";

// import { HelmetProvider } from 'react-helmet-async'
import { Provider } from "react-redux";
import { persistor, store } from "../state/index";
import { PersistGate } from "redux-persist/integration/react";

const Providers = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default Providers;
