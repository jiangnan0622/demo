import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { AddressListPage } from "@/projects/market-making-demo/components/backend-standard-pages";

export default function AddressListManagementRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="asset"
      activeItem="address-list"
      breadcrumb={[{ label: "资产管理" }, { label: "地址表" }]}
    >
      <AddressListPage />
    </BackendConsoleShell>
  );
}
