import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./styles/main.css";
import { AuthProvider } from "./auth/AuthContext";
import { router } from "./router";

const container = document.getElementById("root");
if (!container) throw new Error("#root element not found in index.html");

createRoot(container).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
