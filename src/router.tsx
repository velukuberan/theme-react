import { createHashRouter, Navigate } from "react-router";
import { App } from "./App";
import { GuestOnly, RequireAuth } from "./auth/guards";
import { HelpPage } from "./pages/HelpPage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import { SettingsPage } from "./pages/SettingsPage";
import { WorkbenchPage } from "./pages/WorkbenchPage";

/**
 * Hash routing (#/profile): works from file://, any static host and Tauri without server rewrites.
 *
 *   /login, /register               full-screen, signed-out only
 *   /, /profile, /settings, /help   inside the app shell (App), signed-in only
 */
export const router = createHashRouter([
  {
    element: <GuestOnly />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <App />,
        children: [
          { index: true, element: <WorkbenchPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/settings", element: <SettingsPage /> },
          { path: "/help", element: <HelpPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
