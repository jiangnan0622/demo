import { Suspense } from "react";

import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { RepurchaseListingPage } from "@/projects/market-making-demo/components/repurchase-listing-page";

export default function RepurchaseListingManagementRoutePage() {
  return (
    <BackendConsoleShell activeGroup="market-making" activeItem="repurchase-listing">
      <Suspense fallback={null}>
        <RepurchaseListingPage />
      </Suspense>
    </BackendConsoleShell>
  );
}
