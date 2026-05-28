import { Suspense } from "react";

import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { SecondaryListingPage } from "@/projects/market-making-demo/components/secondary-listing-page";

export default function SecondaryRepurchaseListingRoutePage() {
  return (
    <BackendConsoleShell activeGroup="market-making" activeItem="repurchase-listing">
      <Suspense fallback={null}>
        <SecondaryListingPage initialPageType="REPURCHASE_LISTING" />
      </Suspense>
    </BackendConsoleShell>
  );
}
