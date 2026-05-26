import { redirect } from "next/navigation";

export default function MarketMakingRepurchaseConfigRoutePage() {
  redirect("/backEnd/marketListing/repurchaseListing?config=1");
}
