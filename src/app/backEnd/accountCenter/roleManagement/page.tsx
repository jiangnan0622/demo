import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { RoleManagementPage } from "@/projects/market-making-demo/components/backend-standard-pages";

export default function RoleManagementRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="system"
      activeItem="role-management"
      breadcrumb={[{ label: "系统管理" }, { label: "角色管理" }]}
    >
      <RoleManagementPage />
    </BackendConsoleShell>
  );
}
