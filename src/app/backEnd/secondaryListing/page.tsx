"use client";

import { useEffect } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function SecondaryListingRoutePage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    const config = params.get("config");
    const configQuery = config === "1" || config === "open" ? "?config=1" : "";
    const target =
      tab === "recovery" || tab === "recycle"
        ? "/backEnd/secondaryListing/recycleListing"
        : "/backEnd/secondaryListing/repurchaseListing";

    window.location.replace(`${basePath}${target}${configQuery}`);
  }, []);

  return null;
}
