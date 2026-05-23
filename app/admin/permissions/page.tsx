import { AppShell } from "@/components/app-shell";
import { Badge, Card } from "@/components/ui";
import { rolePermissions } from "@/lib/rbac";
import { roles } from "@/lib/types";

const roleLabels = {
  store_staff: "Store Staff",
  store_manager: "Store Manager",
  service_admin: "Service Admin",
  inventory_admin: "Inventory Admin",
  super_admin: "Super Admin"
};

export default function PermissionsPage() {
  return (
    <AppShell>
      <div className="grid gap-5">
        <div>
          <h3 className="text-xl font-semibold">Role Permission Logic</h3>
          <p className="mt-1 text-sm text-moss">
            App routes check these permissions before reading or mutating Supabase records. Database RLS mirrors the same boundaries.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {roles.map((role) => (
            <Card key={role}>
              <h4 className="text-lg font-semibold">{roleLabels[role]}</h4>
              <div className="mt-4 flex flex-wrap gap-2">
                {rolePermissions[role].map((permission) => (
                  <Badge key={permission}>{permission}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
