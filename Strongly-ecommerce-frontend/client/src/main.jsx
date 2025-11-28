import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx"; 
import { Provider } from "react-redux"; 
import { store } from "./redux/store"; //importar el store de redux
 

createRoot(document.getElementById("root")).render(
  
    <Provider store ={store}>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
    </Provider>
  
);
