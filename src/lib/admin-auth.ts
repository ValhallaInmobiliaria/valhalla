import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isAdminEmail(email: string | null | undefined) {
  const admins = getAdminEmails();
  if (admins.size === 0) return true;
  return Boolean(email && admins.has(email.toLowerCase()));
}

export async function getAdminUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;
  if (error || !user) return null;

  // If ADMIN_EMAILS is configured, only those users can enter the panel.
  // Leaving it empty preserves compatibility while configuring a fresh project.
  if (!isAdminEmail(user.email)) {
    return null;
  }

  return user;
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect("/gestion-valhalla/login");
  return user;
}
