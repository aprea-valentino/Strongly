import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx"; // 🔹 Nuevo import
import { Provider } from "react-redux"; //nuevo import de REDUX

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store ={store}>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
    </Provider>
  </StrictMode>
);
