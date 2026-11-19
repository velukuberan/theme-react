import { SettingsIcon } from "../components/icons";
import { PlaceholderPage } from "./PlaceholderPage";

export function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Theme, default environment, request timeout, SSL and proxy options will live here."
      Icon={SettingsIcon}
    />
  );
}
