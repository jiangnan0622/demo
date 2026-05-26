import type {
  RepurchaseAssetOption,
  RepurchaseListingStatus,
  RepurchaseMarketMakerOption,
  RepurchaseViewerContext,
} from "@/projects/market-making-demo/lib/types";

export type RecoveryListingStatus = RepurchaseListingStatus;
export type RecoveryViewerContext = RepurchaseViewerContext;
export type RecoveryAssetOption = RepurchaseAssetOption;
export type RecoveryMarketMakerOption = RepurchaseMarketMakerOption;
export type RecoveryPriceCurrency = "USDT" | "USDC" | "USD1";

export type RecoveryListingRecord = {
  id: string;
  marketMakerId: string;
  marketMakerName: string;
  assetId: string;
  assetName: string;
  availableRecoveryAmount: number;
  recoveryTotalAmount: number;
  remainingRecoveryAmount: number;
  recoveredAmount: number;
  recoveryPrice: number;
  status: RecoveryListingStatus;
  updatedAt: string;
};

export type RecoveryListingQuery = {
  marketMakerId: string;
  assetName: string;
  status: "ALL" | RecoveryListingStatus;
  page: number;
  pageSize: number;
};

export type RecoveryListingPageResult = {
  items: RecoveryListingRecord[];
  total: number;
};

export type RecoveryListingSavePayload = {
  marketMakerId?: string;
  assetId: string;
  recoveryTotalAmount: number;
  recoveryPrices: Record<RecoveryPriceCurrency, number>;
  status: RecoveryListingStatus;
};
