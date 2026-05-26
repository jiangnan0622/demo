import { Suspense } from "react";

import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { RecoveryListingPage } from "@/projects/market-making-demo/components/recovery-listing-page";

export default function RecycleListingManagementRoutePage() {
  return (
    <BackendConsoleShell activeGroup="market-making" activeItem="recycle-listing">
      <Suspense fallback={null}>
        <RecoveryListingPage />
      </Suspense>
    </BackendConsoleShell>
  );
}
