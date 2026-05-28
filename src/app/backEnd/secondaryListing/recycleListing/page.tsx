import { Suspense } from "react";

import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { SecondaryListingPage } from "@/projects/market-making-demo/components/secondary-listing-page";

export default function SecondaryRecycleListingRoutePage() {
  return (
    <BackendConsoleShell activeGroup="market-making" activeItem="recycle-listing">
      <Suspense fallback={null}>
        <SecondaryListingPage initialPageType="RECOVERY_LISTING" />
      </Suspense>
    </BackendConsoleShell>
  );
}
