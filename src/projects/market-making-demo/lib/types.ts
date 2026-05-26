export type RepurchaseViewerRole = "admin" | "marketMaker";
export type RepurchaseListingStatus = "ONLINE" | "OFFLINE";
export type RepurchaseRoleScope = "MARKET_MAKER";
export type RepurchaseStablecoin = "USDC" | "USDT" | "USD1";

export type RepurchaseViewerContext = {
  role: RepurchaseViewerRole;
  marketMakerId?: string;
  marketMakerName?: string;
};

export type RepurchaseListingRecord = {
  id: string;
  roleScope: RepurchaseRoleScope;
  marketMakerId: string;
  marketMakerName: string;
  assetId: string;
  assetName: string;
  availableQuantity: number;
  listedQuantity: number;
  soldQuantity: number;
  listedPrice: number;
  listedPrices: RepurchaseListedPrice[];
  status: RepurchaseListingStatus;
  updatedAt: string;
};

export type RepurchaseListedPrice = {
  stablecoin: RepurchaseStablecoin;
  price: number;
};

export type RepurchaseAssetOption = {
  id: string;
  name: string;
  availableQuantity: number;
};

export type RepurchaseMarketMakerOption = {
  id: string;
  name: string;
};

export type RepurchaseAssetInventory = {
  marketMakerId: string;
  assetId: string;
  assetName: string;
  availableQuantity: number;
};

export type RepurchaseListingQuery = {
  marketMakerId: string;
  assetName: string;
  status: "ALL" | RepurchaseListingStatus;
  page: number;
  pageSize: number;
};

export type RepurchaseListingPageResult = {
  items: RepurchaseListingRecord[];
  total: number;
};

export type RepurchaseListingSavePayload = {
  id?: string;
  marketMakerId?: string;
  assetId: string;
  listedQuantity: number;
  listedPrices: RepurchaseListedPrice[];
};
