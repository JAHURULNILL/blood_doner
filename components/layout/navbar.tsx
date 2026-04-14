import { getCurrentUser } from "@/lib/auth";
import { NavbarClient } from "@/components/layout/navbar-client";

export async function Navbar() {
  const user = await getCurrentUser();
  return <NavbarClient user={user} />;
}
