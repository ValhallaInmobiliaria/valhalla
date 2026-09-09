import { redirect } from "next/navigation";

import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { getAdminUser } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function GestionLoginPage() {
    const user = await getAdminUser();

    if (user) {
        redirect("/gestion-valhalla");
    }

    return <AdminLoginForm />;
}