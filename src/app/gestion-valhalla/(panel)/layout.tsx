import { requireAdmin } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function GestionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await requireAdmin();

    return (
        <AdminShell email={user.email ?? "Cuenta administrativa"}>
            {children}
        </AdminShell>
    );
}