import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import useAuthStore from "./store/authStore";
import api from "./api/axios";

useAuthStore.getState().initialize();

const { user, token } = useAuthStore.getState();

if (user && !token) {
  (async () => {
    try {
      const refreshRes = await api.post("/auth/refresh");
      const newToken = refreshRes.data.accessToken;

      const userRes = await api.get("/auth/me");
      useAuthStore.getState().login(userRes.data.user, newToken);
    } catch (err) {
      console.error(`Error occurred ${err.message}`);
      window.location.href = "/login";
    }
  })();
} else {
  useAuthStore.getState().logout();
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
