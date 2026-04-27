"use client";

import {
  MOCK_REPURCHASE_ADMIN_VIEWER,
  MOCK_REPURCHASE_MARKET_MAKER_VIEWER,
  REPURCHASE_ASSET_INVENTORIES,
  REPURCHASE_LISTING_MOCK_DATA,
  REPURCHASE_MARKET_MAKER_OPTIONS,
  REPURCHASE_STABLECOIN_OPTIONS,
} from "@/lib/market-making/mock-data";
import type {
  RepurchaseAssetOption,
  RepurchaseListedPrice,
  RepurchaseListingPageResult,
  RepurchaseListingQuery,
  RepurchaseListingRecord,
  RepurchaseListingSavePayload,
  RepurchaseMarketMakerOption,
  RepurchaseViewerContext,
  RepurchaseViewerRole,
} from "@/lib/market-making/types";

const STORAGE_KEY = "market-making-repurchase-listings";
const ROLE_STORAGE_KEY = "market-making-current-role";
const DEFAULT_PAGE_SIZE = 8;
const MIN_LISTED_PRICE = 0.9;
const MAX_LISTED_PRICE = 1.1;
const CURRENT_ASSET_INVENTORY_KEYS = new Set(
  REPURCHASE_ASSET_INVENTORIES.map((item) => `${item.marketMakerId}:${item.assetId}`)
);
const CURRENT_MARKET_MAKER_IDS = new Set(REPURCHASE_MARKET_MAKER_OPTIONS.map((item) => item.id));

function delay(ms = 220) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function formatDateTime(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getPrimaryListedPrice(listedPrices: RepurchaseListedPrice[]) {
  return listedPrices.find((item) => item.stablecoin === "USDC")?.price ?? listedPrices[0]?.price ?? 0;
}

function summarizeListedPrices(listedPrices: RepurchaseListedPrice[]) {
  return listedPrices
    .map((item) => `${item.stablecoin} ${item.price}`)
    .join(" / ");
}

function getInventoryByKey(marketMakerId: string, assetId: string) {
  return REPURCHASE_ASSET_INVENTORIES.find(
    (item) => item.marketMakerId === marketMakerId && item.assetId === assetId
  );
}

function getOnlineOccupiedQuantity(
  records: RepurchaseListingRecord[],
  marketMakerId: string,
  assetId: string,
  excludeId?: string
) {
  return records
    .filter(
      (item) =>
        item.marketMakerId === marketMakerId &&
        item.assetId === assetId &&
        item.status === "ONLINE" &&
        item.id !== excludeId
    )
    .reduce((total, item) => total + Math.max(item.listedQuantity - item.soldQuantity, 0), 0);
}

function getAvailableQuantityForDisplay(
  records: RepurchaseListingRecord[],
  marketMakerId: string,
  assetId: string
) {
  const inventory = getInventoryByKey(marketMakerId, assetId);
  if (!inventory) {
    return 0;
  }

  const occupied = getOnlineOccupiedQuantity(records, marketMakerId, assetId);
  return Math.max(inventory.availableQuantity - occupied, 0);
}

function getMaxConfigurableQuantity(
  records: RepurchaseListingRecord[],
  marketMakerId: string,
  assetId: string,
  recordId?: string
) {
  const inventory = getInventoryByKey(marketMakerId, assetId);
  if (!inventory) {
    return 0;
  }

  const occupiedByOtherRecords = getOnlineOccupiedQuantity(records, marketMakerId, assetId, recordId);
  return Math.max(inventory.availableQuantity - occupiedByOtherRecords, 0);
}

function applyViewerScope(records: RepurchaseListingRecord[], viewer: RepurchaseViewerContext) {
  if (viewer.role === "admin") {
    return records;
  }

  return records.filter((item) => item.marketMakerId === viewer.marketMakerId);
}

function readListings() {
  if (typeof window === "undefined") {
    return [...REPURCHASE_LISTING_MOCK_DATA];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(REPURCHASE_LISTING_MOCK_DATA));
    return [...REPURCHASE_LISTING_MOCK_DATA];
  }

  try {
    const parsed = JSON.parse(raw) as RepurchaseListingRecord[];
    if (!Array.isArray(parsed)) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(REPURCHASE_LISTING_MOCK_DATA));
      return [...REPURCHASE_LISTING_MOCK_DATA];
    }

    const hasLegacyRecord = parsed.some((item) => {
      const inventoryKey = `${item.marketMakerId}:${item.assetId}`;
      return (
        item.roleScope !== "MARKET_MAKER" ||
        !item.updatedAt ||
        typeof item.soldQuantity !== "number" ||
        !Array.isArray(item.listedPrices) ||
        item.listedPrices.length === 0 ||
        !CURRENT_MARKET_MAKER_IDS.has(item.marketMakerId) ||
        !CURRENT_ASSET_INVENTORY_KEYS.has(inventoryKey)
      );
    });

    if (hasLegacyRecord) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(REPURCHASE_LISTING_MOCK_DATA));
      return [...REPURCHASE_LISTING_MOCK_DATA];
    }

    return parsed.map((item) => {
      const inventory = getInventoryByKey(item.marketMakerId, item.assetId);
      const marketMaker = REPURCHASE_MARKET_MAKER_OPTIONS.find(
        (option) => option.id === item.marketMakerId
      );
      return inventory && marketMaker
        ? {
            ...item,
            marketMakerName: marketMaker.name,
            assetName: inventory.assetName,
            availableQuantity: getAvailableQuantityForDisplay(parsed, item.marketMakerId, item.assetId),
            listedPrice: getPrimaryListedPrice(item.listedPrices),
          }
        : item;
    });
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(REPURCHASE_LISTING_MOCK_DATA));
    return [...REPURCHASE_LISTING_MOCK_DATA];
  }
}

function writeListings(nextRecords: RepurchaseListingRecord[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
  }
}

function filterListings(records: RepurchaseListingRecord[], query: RepurchaseListingQuery) {
  const keyword = query.assetName.trim().toLowerCase();

  return records.filter((item) => {
    const matchesMarketMaker = !query.marketMakerId || item.marketMakerId === query.marketMakerId;
    const matchesKeyword =
      !keyword ||
      item.assetName.toLowerCase().includes(keyword) ||
      item.assetId.toLowerCase().includes(keyword);
    const matchesStatus = query.status === "ALL" || item.status === query.status;

    return matchesMarketMaker && matchesKeyword && matchesStatus;
  });
}

export function getRepurchaseCurrentViewer(roleFromQuery?: string | null): RepurchaseViewerContext {
  const normalizeRole = (role: string | null | undefined): RepurchaseViewerRole | null => {
    if (role === "admin" || role === "marketMaker") {
      return role;
    }
    return null;
  };

  if (typeof window === "undefined") {
    return MOCK_REPURCHASE_ADMIN_VIEWER;
  }

  const nextRole = normalizeRole(roleFromQuery) ?? normalizeRole(window.localStorage.getItem(ROLE_STORAGE_KEY));
  const resolvedRole = nextRole ?? MOCK_REPURCHASE_ADMIN_VIEWER.role;

  window.localStorage.setItem(ROLE_STORAGE_KEY, resolvedRole);
  return resolvedRole === "marketMaker"
    ? MOCK_REPURCHASE_MARKET_MAKER_VIEWER
    : MOCK_REPURCHASE_ADMIN_VIEWER;
}

export async function getRepurchaseMarketMakers(
  viewer: RepurchaseViewerContext
): Promise<RepurchaseMarketMakerOption[]> {
  await delay(120);
  if (viewer.role === "admin") {
    return [...REPURCHASE_MARKET_MAKER_OPTIONS];
  }

  return REPURCHASE_MARKET_MAKER_OPTIONS.filter((item) => item.id === viewer.marketMakerId);
}

export async function getRepurchaseAssets(params: {
  viewer: RepurchaseViewerContext;
  marketMakerId?: string;
}): Promise<RepurchaseAssetOption[]> {
  await delay(120);
  const records = readListings();

  const scopedMarketMakerId =
    params.viewer.role === "marketMaker" ? params.viewer.marketMakerId : params.marketMakerId;
  if (!scopedMarketMakerId) {
    return [];
  }

  const onlineListingAssetIds = new Set(
    readListings()
      .filter((item) => item.marketMakerId === scopedMarketMakerId && item.status === "ONLINE")
      .map((item) => item.assetId)
  );

  return REPURCHASE_ASSET_INVENTORIES.filter(
    (item) => item.marketMakerId === scopedMarketMakerId && !onlineListingAssetIds.has(item.assetId)
  ).map((item) => ({
    id: item.assetId,
    name: item.assetName,
    availableQuantity: getAvailableQuantityForDisplay(records, item.marketMakerId, item.assetId),
  }));
}

export async function queryRepurchaseListings(
  query: RepurchaseListingQuery,
  viewer: RepurchaseViewerContext
): Promise<RepurchaseListingPageResult> {
  await delay();
  const records = applyViewerScope(readListings(), viewer);
  const filtered = filterListings(records, query);
  const startIndex = (query.page - 1) * query.pageSize;
  const endIndex = startIndex + query.pageSize;

  return {
    items: filtered.slice(startIndex, endIndex),
    total: filtered.length,
  };
}

export async function getRepurchaseListingById(id: string, viewer: RepurchaseViewerContext) {
  await delay(120);
  const records = readListings();
  const detail = records.find((item) => item.id === id) ?? null;
  if (!detail) {
    return null;
  }

  const scopedItems = applyViewerScope([detail], viewer);
  if (!scopedItems[0]) {
    return null;
  }

  return {
    ...scopedItems[0],
    availableQuantity: getMaxConfigurableQuantity(
      records,
      scopedItems[0].marketMakerId,
      scopedItems[0].assetId,
      scopedItems[0].id
    ),
  };
}

export async function saveRepurchaseListing(
  payload: RepurchaseListingSavePayload,
  viewer: RepurchaseViewerContext
) {
  await delay();
  const records = readListings();
  const currentRecord = payload.id ? records.find((item) => item.id === payload.id) : null;

  if (payload.id && !currentRecord) {
    throw new Error("未找到当前上架记录");
  }

  if (viewer.role === "marketMaker" && currentRecord && currentRecord.marketMakerId !== viewer.marketMakerId) {
    throw new Error("无权修改其他做市商记录");
  }

  const targetMarketMakerId =
    viewer.role === "marketMaker" ? viewer.marketMakerId : payload.marketMakerId ?? currentRecord?.marketMakerId;

  if (!targetMarketMakerId) {
    throw new Error("请选择有效的做市商");
  }

  const marketMaker = REPURCHASE_MARKET_MAKER_OPTIONS.find((item) => item.id === targetMarketMakerId);
  if (!marketMaker) {
    throw new Error("请选择有效的做市商");
  }

  const inventory = getInventoryByKey(targetMarketMakerId, payload.assetId);
  if (!inventory) {
    throw new Error("请选择当前做市商可上架的资产");
  }

  if (payload.listedQuantity <= 0) {
    throw new Error("请输入有效的上架数量");
  }

  const maxConfigurableQuantity = getMaxConfigurableQuantity(
    records,
    targetMarketMakerId,
    payload.assetId,
    payload.id
  );

  if (payload.listedQuantity > maxConfigurableQuantity) {
    throw new Error("上架数量不能超过当前可继续上架数量");
  }

  if (!Array.isArray(payload.listedPrices) || payload.listedPrices.length === 0) {
    throw new Error("请至少配置一条稳定币价格");
  }

  const stablecoinSet = new Set<string>();
  for (const item of payload.listedPrices) {
    if (!REPURCHASE_STABLECOIN_OPTIONS.includes(item.stablecoin)) {
      throw new Error("请选择有效的稳定币类型");
    }
    if (stablecoinSet.has(item.stablecoin)) {
      throw new Error("稳定币类型不能重复");
    }
    if (item.price <= 0) {
      throw new Error("请输入有效的上架价格");
    }
    if (item.price < MIN_LISTED_PRICE || item.price > MAX_LISTED_PRICE) {
      throw new Error(`上架价格需保持在 ${MIN_LISTED_PRICE} - ${MAX_LISTED_PRICE} 区间`);
    }
    stablecoinSet.add(item.stablecoin);
  }

  if (currentRecord) {
    if (currentRecord.marketMakerId !== targetMarketMakerId || currentRecord.assetId !== payload.assetId) {
      throw new Error("编辑时不允许修改记录归属");
    }
    if (payload.listedQuantity < currentRecord.soldQuantity) {
      throw new Error("上架数量不能小于已售数量");
    }
  }

  const duplicated = records.find(
    (item) =>
      item.marketMakerId === targetMarketMakerId &&
      item.assetId === payload.assetId &&
      item.status === "ONLINE" &&
      item.id !== payload.id
  );

  if (duplicated) {
    throw new Error("该做市商下的资产已存在有效上架记录");
  }

  const nextRecord: RepurchaseListingRecord = {
    id: payload.id ?? `rp-${Date.now()}`,
    roleScope: "MARKET_MAKER",
    marketMakerId: marketMaker.id,
    marketMakerName: marketMaker.name,
    assetId: inventory.assetId,
    assetName: inventory.assetName,
    availableQuantity: getAvailableQuantityForDisplay(records, marketMaker.id, inventory.assetId),
    listedQuantity: payload.listedQuantity,
    soldQuantity: currentRecord?.soldQuantity ?? 0,
    listedPrice: getPrimaryListedPrice(payload.listedPrices),
    listedPrices: payload.listedPrices,
    status: currentRecord?.status ?? "ONLINE",
    updatedAt: formatDateTime(),
  };

  const nextRecords = payload.id
    ? records.map((item) => (item.id === payload.id ? nextRecord : item))
    : [nextRecord, ...records];

  writeListings(nextRecords);
  return nextRecord;
}

function createCsv(records: RepurchaseListingRecord[]) {
  const header = [
    "做市商",
    "资产名称",
    "可上架",
    "上架总量",
    "已售",
    "在售",
    "上架价格",
    "状态",
    "更新时间",
  ];
  const rows = records.map((item) => {
    const remaining = Math.max(item.listedQuantity - item.soldQuantity, 0);
    const soldOut = remaining === 0 && item.listedQuantity > 0;
    const statusLabel =
      item.status === "ONLINE" ? "已上架" : soldOut ? "已下架（售完）" : "已下架";
    return [
      item.marketMakerName,
      item.assetName,
      String(item.availableQuantity),
      String(item.listedQuantity),
      String(item.soldQuantity),
      String(remaining),
      summarizeListedPrices(item.listedPrices),
      statusLabel,
      item.updatedAt,
    ];
  });

  return [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll("\"", "\"\"")}"`).join(","))
    .join("\n");
}

export async function offlineRepurchaseListing(id: string, viewer: RepurchaseViewerContext) {
  await delay();
  const records = readListings();
  const current = records.find((item) => item.id === id);

  if (!current) {
    throw new Error("未找到当前上架记录");
  }

  if (viewer.role === "marketMaker" && current.marketMakerId !== viewer.marketMakerId) {
    throw new Error("无权下架其他做市商记录");
  }

  if (current.status !== "ONLINE") {
    throw new Error("该记录已下架，无需重复操作");
  }

  const next: RepurchaseListingRecord = {
    ...current,
    status: "OFFLINE",
    updatedAt: formatDateTime(),
  };

  writeListings(records.map((item) => (item.id === id ? next : item)));
  return next;
}

export async function exportRepurchaseListings(
  query: Omit<RepurchaseListingQuery, "page" | "pageSize">,
  viewer: RepurchaseViewerContext
) {
  await delay(120);
  const records = applyViewerScope(readListings(), viewer);
  const filtered = filterListings(records, {
    ...query,
    page: 1,
    pageSize: Number.MAX_SAFE_INTEGER,
  });
  const csv = createCsv(filtered);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "回购上架.csv";
  link.click();
  window.URL.revokeObjectURL(url);
}

export function createDefaultRepurchaseQuery(viewer?: RepurchaseViewerContext): RepurchaseListingQuery {
  return {
    marketMakerId: viewer?.role === "marketMaker" ? viewer.marketMakerId ?? "" : "",
    assetName: "",
    status: "ALL",
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  };
}
