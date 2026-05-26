import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { ProductListPage } from "@/projects/market-making-demo/components/product-list-page";

export default function ProductConfigListRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="product"
      activeItem="product-list"
      breadcrumb={[{ label: "产品配置" }, { label: "产品列表" }]}
    >
      <ProductListPage />
    </BackendConsoleShell>
  );
}
