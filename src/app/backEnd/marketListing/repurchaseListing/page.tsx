"use client";

import { useEffect } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function RepurchaseListingManagementRoutePage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const config = params.get("config");
    const configQuery = config === "1" || config === "open" ? "?config=1" : "";

    window.location.replace(`${basePath}/backEnd/secondaryListing/repurchaseListing${configQuery}`);
  }, []);

  return null;
}
