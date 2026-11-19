import { UserPlusIcon } from "../../components/icons";
import { PlaceholderPage } from "../PlaceholderPage";

/** Placeholder until the invite form arrives in the next PR. */
export function NewUserPage() {
  return (
    <PlaceholderPage
      title="Add new user"
      description="Invite someone by email, or create an activation link to send them yourself."
      Icon={UserPlusIcon}
    />
  );
}
