import { UsersIcon } from "../components/icons";
import { PlaceholderPage } from "./PlaceholderPage";

export function UsersPage() {
  return (
    <PlaceholderPage
      title="Users"
      description="Invite, view, edit, suspend and restore users, and manage their sessions."
      Icon={UsersIcon}
    />
  );
}
