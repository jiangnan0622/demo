import type {
  RepurchaseAssetInventory,
  RepurchaseListedPrice,
  RepurchaseListingRecord,
  RepurchaseMarketMakerOption,
  RepurchaseStablecoin,
  RepurchaseViewerContext,
} from "@/lib/market-making/types";

export const MOCK_REPURCHASE_ADMIN_VIEWER: RepurchaseViewerContext = {
  role: "admin",
};

export const MOCK_REPURCHASE_MARKET_MAKER_VIEWER: RepurchaseViewerContext = {
  role: "marketMaker",
  marketMakerId: "mm-alpha",
  marketMakerName: "做市商Alpha",
};

export const REPURCHASE_MARKET_MAKER_OPTIONS: RepurchaseMarketMakerOption[] = [
  { id: "mm-alpha", name: "做市商Alpha" },
  { id: "mm-beta", name: "做市商Beta" },
  { id: "mm-gamma", name: "做市商Gamma" },
] as const;

export const REPURCHASE_STABLECOIN_OPTIONS: RepurchaseStablecoin[] = ["USDC", "USDT", "USD1"] as const;

function createListedPrices(prices: RepurchaseListedPrice[]) {
  return prices;
}

export const REPURCHASE_ASSET_INVENTORIES: RepurchaseAssetInventory[] = [
  { marketMakerId: "mm-alpha", assetId: "ast-rsdct", assetName: "rSDCT商都城投", availableQuantity: 128000 },
  { marketMakerId: "mm-alpha", assetId: "ast-rxwct", assetName: "rXWCT兴尉城投", availableQuantity: 96000 },
  { marketMakerId: "mm-beta", assetId: "ast-rxwct", assetName: "rXWCT兴尉城投", availableQuantity: 86000 },
  { marketMakerId: "mm-beta", assetId: "ast-rfuidl", assetName: "rFUIDL复星财富控股", availableQuantity: 72000 },
  { marketMakerId: "mm-gamma", assetId: "ast-rsdct", assetName: "rSDCT商都城投", availableQuantity: 54000 },
  { marketMakerId: "mm-gamma", assetId: "ast-rfuidl", assetName: "rFUIDL复星财富控股", availableQuantity: 64000 },
] as const;

export const REPURCHASE_LISTING_MOCK_DATA: RepurchaseListingRecord[] = [
  {
    id: "rp-10001",
    roleScope: "MARKET_MAKER",
    marketMakerId: "mm-alpha",
    marketMakerName: "做市商Alpha",
    assetId: "ast-rsdct",
    assetName: "rSDCT商都城投",
    availableQuantity: 128000,
    listedQuantity: 20000,
    soldQuantity: 5000,
    listedPrice: 0.96,
    listedPrices: createListedPrices([
      { stablecoin: "USDC", price: 0.96 },
      { stablecoin: "USDT", price: 0.97 },
    ]),
    status: "ONLINE",
    updatedAt: "2026-04-21 13:20:15",
  },
  {
    id: "rp-10002",
    roleScope: "MARKET_MAKER",
    marketMakerId: "mm-beta",
    marketMakerName: "做市商Beta",
    assetId: "ast-rxwct",
    assetName: "rXWCT兴尉城投",
    availableQuantity: 86000,
    listedQuantity: 15000,
    soldQuantity: 3000,
    listedPrice: 1.03,
    listedPrices: createListedPrices([
      { stablecoin: "USDC", price: 1.03 },
      { stablecoin: "USD1", price: 1.01 },
    ]),
    status: "OFFLINE",
    updatedAt: "2026-04-21 13:22:48",
  },
  {
    id: "rp-10003",
    roleScope: "MARKET_MAKER",
    marketMakerId: "mm-gamma",
    marketMakerName: "做市商Gamma",
    assetId: "ast-rfuidl",
    assetName: "rFUIDL复星财富控股",
    availableQuantity: 64000,
    listedQuantity: 18000,
    soldQuantity: 18000,
    listedPrice: 1.08,
    listedPrices: createListedPrices([
      { stablecoin: "USDC", price: 1.08 },
      { stablecoin: "USDT", price: 1.06 },
      { stablecoin: "USD1", price: 1.04 },
    ]),
    status: "OFFLINE",
    updatedAt: "2026-04-21 13:25:30",
  },
] as const;
