"use client";

import {
  getRepurchaseAssets,
  getRepurchaseCurrentViewer,
  getRepurchaseMarketMakers,
} from "@/projects/market-making-demo/services/market-making.service";
import type {
  RecoveryAssetOption,
  RecoveryListingPageResult,
  RecoveryListingQuery,
  RecoveryListingSavePayload,
  RecoveryMarketMakerOption,
  RecoveryViewerContext,
} from "@/projects/market-making-demo/lib/recovery-types";

const DEFAULT_PAGE_SIZE = 8;

function delay(ms = 220) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function getRecoveryCurrentViewer(roleFromQuery?: string | null): RecoveryViewerContext {
  return getRepurchaseCurrentViewer(roleFromQuery);
}

export async function getRecoveryMarketMakers(
  viewer: RecoveryViewerContext
): Promise<RecoveryMarketMakerOption[]> {
  return getRepurchaseMarketMakers(viewer);
}

export async function getRecoveryAssets(params: {
  viewer: RecoveryViewerContext;
  marketMakerId?: string;
}): Promise<RecoveryAssetOption[]> {
  return getRepurchaseAssets(params);
}

export async function queryRecoveryListings(
  query: RecoveryListingQuery,
  viewer: RecoveryViewerContext
): Promise<RecoveryListingPageResult> {
  void query;
  void viewer;
  await delay();
  return {
    items: [],
    total: 0,
  };
}

export async function saveRecoveryListing(
  payload: RecoveryListingSavePayload,
  viewer: RecoveryViewerContext
) {
  void payload;
  void viewer;
  await delay();
  throw new Error("回收上架接口暂未接入");
}

export function createDefaultRecoveryQuery(viewer?: RecoveryViewerContext): RecoveryListingQuery {
  return {
    marketMakerId: viewer?.role === "marketMaker" ? viewer.marketMakerId ?? "" : "",
    assetName: "",
    status: "ALL",
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  };
}
