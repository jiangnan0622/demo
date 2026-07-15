export type PriceParameterRecord = {
  priceDate: string;
  price: string;
  currency: string;
  latestPriceUpdateTime: string;
};

export const priceParameterColumns = ["价格日期", "价格", "币种", "最新价格更新时间", "操作"] as const;

export const priceParameterSummary = {
  latestPrice: "1.0000000000",
  currency: "USD",
  latestPriceDate: "2026-07-14",
  latestUpdateTime: "2026-07-15 09:01:12",
  total: 65,
} as const;

export const priceParameterRecords: readonly PriceParameterRecord[] = [
  { priceDate: "2026-07-14", price: "1.0000000000", currency: "USD", latestPriceUpdateTime: "2026-07-15 09:01:12" },
  { priceDate: "2026-07-13", price: "1.0000000000", currency: "USD", latestPriceUpdateTime: "2026-07-14 09:01:12" },
  { priceDate: "2026-07-10", price: "1.0000000000", currency: "USD", latestPriceUpdateTime: "2026-07-11 09:01:12" },
];
