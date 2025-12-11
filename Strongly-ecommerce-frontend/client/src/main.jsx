import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx"; 
import { Provider } from "react-redux"; 
import { store, persistor } from "./redux/store"; //importar el store de redux
import { PersistGate } from 'redux-persist/integration/react';
 

createRoot(document.getElementById("root")).render(
  
    <Provider store ={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </PersistGate>
    </Provider>
  
);
