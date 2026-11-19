import { createHashRouter, Navigate } from "react-router";
import { App } from "./App";
import { GuestOnly, RequireAuth, RequirePermission } from "./auth/guards";
import { HelpPage } from "./pages/HelpPage";
import { LoginPage } from "./pages/LoginPage";
import { AccountTab } from "./pages/profile/AccountTab";
import { ProfileLayout } from "./pages/profile/ProfileLayout";
import { SessionsTab } from "./pages/profile/SessionsTab";
import { RegisterPage } from "./pages/RegisterPage";
import { SettingsPage } from "./pages/SettingsPage";
import { NewUserPage } from "./pages/users/NewUserPage";
import { UserDetailsTab } from "./pages/users/UserDetailsTab";
import { UserLayout } from "./pages/users/UserLayout";
import { UserSessionsTab } from "./pages/users/UserSessionsTab";
import { UsersListPage } from "./pages/users/UsersListPage";
import { WorkbenchPage } from "./pages/WorkbenchPage";

/**
 * Hash routing (#/profile): works from file://, any static host and Tauri without server rewrites.
 *
 *   /login, /register               full-screen, signed-out only
 *   /, /profile, /profile/sessions, /settings, /help
 *                                   inside the app shell (App), signed-in only
 *   /users, /users/new, /users/:userId[/sessions]
 *                                   also need the users.manage permission (else: home)
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
          {
            path: "/profile",
            element: <ProfileLayout />,
            children: [
              { index: true, element: <AccountTab /> },
              { path: "sessions", element: <SessionsTab /> },
            ],
          },
          {
            element: <RequirePermission permission="users.manage" />,
            children: [
              { path: "/users", element: <UsersListPage /> },
              { path: "/users/new", element: <NewUserPage /> },
              {
                path: "/users/:userId",
                element: <UserLayout />,
                children: [
                  { index: true, element: <UserDetailsTab /> },
                  { path: "sessions", element: <UserSessionsTab /> },
                ],
              },
            ],
          },
          { path: "/settings", element: <SettingsPage /> },
          { path: "/help", element: <HelpPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
