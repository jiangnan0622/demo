import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { UserListPage } from "@/projects/market-making-demo/components/backend-standard-pages";

export default function UserManagementUserListRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="user-management"
      activeItem="user-list"
      breadcrumb={[{ label: "用户管理" }, { label: "用户列表" }]}
    >
      <UserListPage />
    </BackendConsoleShell>
  );
}
