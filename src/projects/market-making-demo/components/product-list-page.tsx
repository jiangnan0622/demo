"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useGlobalFeedback } from "@/components/feedback/global-feedback-provider";
import {
  DEFAULT_RWA_PRODUCT_TRADING_CONFIG,
  getRwaProductTradingConfig,
  saveRwaProductTradingConfig,
  type RwaProductTradingConfig,
} from "@/projects/realrwa-demo/lib/rwa-product-trading";

type ProductRow = {
  id: string;
  contract: string;
  symbol: string;
  productType: "MONEY_MARKET" | "CORPORATE_BOND";
  rwaAsset: "AUSD" | "BUSD";
  sellPrices: StablecoinPrices;
  repurchasePrices: StablecoinPrices;
  enSellPrices: StablecoinPrices;
  enRepurchasePrices: StablecoinPrices;
  totalAmount: string;
  pointCommissionRate: string;
  commissionRate: string;
  totalCommission: string;
  headCommission: string;
  createdAt: string;
  emergencyClosed: boolean;
  marketMakers: MarketMakerEntry[];
  description?: string;
  descriptionImages?: string[];
  productLogoImage?: string;
  chainNetwork?: string;
  issuedAmount?: string;
  bondAnnualYield?: string;
  baseAnnualRate?: string;
  pointAnnualRate?: string;
  commissionAnnualRate?: string;
  zhContent?: ProductLocaleContent;
  englishContent?: ProductLocaleContent;
  takerFeeRate?: string;
  makerFeeRate?: string;
  changeNotes?: string;
};

type StablecoinPrices = {
  USDC: string;
  USDT: string;
  USD1: string;
};

type MarketMakerEntry = {
  address: string;
  name: string;
};

type ProductFormLocale = "zh" | "en";

type ProductLocaleContent = {
  productTypeName: string;
  bondName: string;
  displayMerchant: string;
  underlyingScale: string;
  minimumOrder: string;
  tradingRule: string;
  tags: string;
  tagTwo: string;
  tagThree: string;
  description: string;
  detailDescription: string;
};

const defaultMarketMaker: MarketMakerEntry = {
  address: "0x8b6F7dC2A4E19B5c3D0F9a6E72B4C1d5F8A0e9C3",
  name: "做市商a",
};

type ProductFilters = {
  productType: "" | ProductRow["productType"];
  rwaAsset: "" | ProductRow["rwaAsset"];
  startDate: string;
  endDate: string;
};

const productTypeLabels: Record<ProductRow["productType"], string> = {
  MONEY_MARKET: "货币基金",
  CORPORATE_BOND: "企业债券",
};

const productTypeOptions: Array<{ label: string; value: ProductRow["productType"] }> = [
  { label: "货币基金产品", value: "MONEY_MARKET" },
  { label: "企业债券产品", value: "CORPORATE_BOND" },
];

const defaultStablecoinPrices: StablecoinPrices = { USDC: "1.0000", USDT: "1.0000", USD1: "1.0000" };
const blankStablecoinPrices: StablecoinPrices = { USDC: "", USDT: "", USD1: "" };

const rwaAssetOptions: ProductRow["rwaAsset"][] = ["AUSD", "BUSD"];

function getProductLogoUrl(symbol: string) {
  return `https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/${symbol || "rFUIDL"}.png`;
}

function parseAmount(value: string) {
  const amount = Number(value.replace(/,/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function formatAmount(value: number, maximumFractionDigits = 2) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });
}

function PriceStack({ prices }: { prices: StablecoinPrices }) {
  return (
    <div className="whitespace-nowrap text-[12px] font-medium leading-4 text-slate-700">
      {`${prices.USDC}/${prices.USDT}/${prices.USD1}`}
    </div>
  );
}

const initialProducts: ProductRow[] = [
  {
    id: "204947...091010",
    contract: "0x8bef...97b3",
    symbol: "rFUIDL",
    productType: "MONEY_MARKET",
    rwaAsset: "AUSD",
    sellPrices: { USDC: "1.0008", USDT: "1.0012", USD1: "0.9996" },
    repurchasePrices: { USDC: "0.9986", USDT: "0.9990", USD1: "0.9978" },
    enSellPrices: { USDC: "1.0008", USDT: "1.0012", USD1: "0.9996" },
    enRepurchasePrices: { USDC: "0.9986", USDT: "0.9990", USD1: "0.9978" },
    totalAmount: "12,480.32",
    pointCommissionRate: "2%",
    commissionRate: "6%",
    totalCommission: "748.82",
    headCommission: "0",
    createdAt: "2026-05-06 16:00:00",
    emergencyClosed: false,
    marketMakers: [defaultMarketMaker],
    takerFeeRate: "0.20%",
    makerFeeRate: "0.15%",
    changeNotes: "2026年5月12日 16:00，调整卖出价为 1.0008/1.0012/0.9996；回购价为 0.9986/0.9990/0.9978。",
    englishContent: {
      productTypeName: "Money Market Fund",
      bondName: "Mellon Money Market Fund",
      displayMerchant: "Mellon",
      underlyingScale: "USD liquidity fund",
      minimumOrder: "Min 1 rFUIDL",
      tradingRule: "Workdays before 11:00",
      tags: "Money Market",
      tagTwo: "Daily Liquidity",
      tagThree: "iREAL Rewards",
      description: "Tokenized money-market RWA product for USD liquidity management.",
      detailDescription: "Markdown supported product detail for the rFUIDL money-market product.",
    },
  },
  {
    id: "204947...607297",
    contract: "0x3bd2...c54e",
    symbol: "rXWCT",
    productType: "CORPORATE_BOND",
    rwaAsset: "AUSD",
    sellPrices: { USDC: "1.0062", USDT: "1.0049", USD1: "1.0080" },
    repurchasePrices: { USDC: "0.9948", USDT: "0.9960", USD1: "0.9935" },
    enSellPrices: { USDC: "1.0062", USDT: "1.0049", USD1: "1.0080" },
    enRepurchasePrices: { USDC: "0.9948", USDT: "0.9960", USD1: "0.9935" },
    totalAmount: "86,300.00",
    pointCommissionRate: "1.5%",
    commissionRate: "4.5%",
    totalCommission: "5,178.00",
    headCommission: "120.00",
    createdAt: "2026-05-06 16:00:00",
    emergencyClosed: false,
    marketMakers: [defaultMarketMaker],
    takerFeeRate: "0.25%",
    makerFeeRate: "0.18%",
    changeNotes: "2026年5月12日 16:00，调整企业债券产品双向报价。",
    englishContent: {
      productTypeName: "Corporate Bond",
      bondName: "Xingwei City Investment Bond",
      displayMerchant: "Xingwei",
      underlyingScale: "Municipal bond asset",
      minimumOrder: "Min 1 rXWCT",
      tradingRule: "Open market trading",
      tags: "Corporate Bond",
      tagTwo: "Yield Asset",
      tagThree: "Secondary Market",
      description: "Tokenized corporate bond RWA product.",
      detailDescription: "Markdown supported product detail for rXWCT.",
    },
  },
  {
    id: "204947...856834",
    contract: "0x48bf...eb6f",
    symbol: "rSDCT",
    productType: "CORPORATE_BOND",
    rwaAsset: "BUSD",
    sellPrices: { USDC: "0.9974", USDT: "0.9991", USD1: "1.0020" },
    repurchasePrices: { USDC: "0.9916", USDT: "0.9932", USD1: "0.9950" },
    enSellPrices: { USDC: "0.9974", USDT: "0.9991", USD1: "1.0020" },
    enRepurchasePrices: { USDC: "0.9916", USDT: "0.9932", USD1: "0.9950" },
    totalAmount: "64,250.00",
    pointCommissionRate: "1.2%",
    commissionRate: "4.2%",
    totalCommission: "3,855.00",
    headCommission: "90.00",
    createdAt: "2026-05-06 16:00:00",
    emergencyClosed: false,
    marketMakers: [defaultMarketMaker],
    takerFeeRate: "0.25%",
    makerFeeRate: "0.18%",
    changeNotes: "2026年5月12日 16:00，调整企业债券产品双向报价。",
    englishContent: {
      productTypeName: "Corporate Bond",
      bondName: "Shangdu City Investment Bond",
      displayMerchant: "Shangdu",
      underlyingScale: "Municipal bond asset",
      minimumOrder: "Min 1 rSDCT",
      tradingRule: "Open market trading",
      tags: "Corporate Bond",
      tagTwo: "Yield Asset",
      tagThree: "Secondary Market",
      description: "Tokenized corporate bond RWA product.",
      detailDescription: "Markdown supported product detail for rSDCT.",
    },
  },
];

const weekdays = ["星期一", "星期二", "星期三", "星期四", "星期五"];
const calendarDays = Array.from({ length: 30 }, (_, index) => index + 1);

function StatCard({ title, value, unit }: { title: string; value: string; unit?: string }) {
  return (
    <div className="rounded-[8px] border border-[#dde7ff] bg-[#eef3ff] px-6 py-5">
      <p className="text-[13px] text-slate-600">{title}</p>
      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="text-[30px] font-semibold leading-none text-[#1f5bd8]">{value}</span>
        {unit ? <span className="text-[12px] text-[#1f5bd8]/70">{unit}</span> : null}
      </p>
    </div>
  );
}

function FilterBar({
  filters,
  onChange,
  onSearch,
  onReset,
  onExport,
}: {
  filters: ProductFilters;
  onChange: (next: ProductFilters) => void;
  onSearch: () => void;
  onReset: () => void;
  onExport: () => void;
}) {
  return (
    <div className="rounded-[8px] border border-[#eceff5] bg-white px-5 py-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-slate-600">产品类型</span>
          <select
            className="h-9 w-[170px] rounded-[6px] border border-[#dcdfe6] bg-white px-3 text-[13px] text-slate-600 outline-none focus:border-[#1f5bd8]"
            value={filters.productType}
            onChange={(event) =>
              onChange({ ...filters, productType: event.target.value as ProductFilters["productType"] })
            }
          >
            <option value="">产品类型</option>
            {productTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-slate-600">RWA 资产</span>
          <select
            className="h-9 w-[170px] rounded-[6px] border border-[#dcdfe6] bg-white px-3 text-[13px] text-slate-600 outline-none focus:border-[#1f5bd8]"
            value={filters.rwaAsset}
            onChange={(event) =>
              onChange({ ...filters, rwaAsset: event.target.value as ProductFilters["rwaAsset"] })
            }
          >
            <option value="">RWA 资产</option>
            {rwaAssetOptions.map((asset) => (
              <option key={asset} value={asset}>
                {asset}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-slate-600">日期</span>
          <div className="flex h-9 w-[300px] items-center gap-2 rounded-[6px] border border-[#dcdfe6] bg-white px-3 text-[13px] text-slate-400">
            <input
              type="date"
              className="w-[112px] bg-transparent text-[13px] text-slate-600 outline-none"
              value={filters.startDate}
              onChange={(event) => onChange({ ...filters, startDate: event.target.value })}
            />
            <span className="text-slate-300">→</span>
            <input
              type="date"
              className="w-[112px] bg-transparent text-[13px] text-slate-600 outline-none"
              value={filters.endDate}
              onChange={(event) => onChange({ ...filters, endDate: event.target.value })}
            />
            <Calendar className="ml-auto size-3.5 text-slate-400" />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="h-9 rounded-[6px] bg-[#1f5bd8] px-5 text-[13px] font-medium text-white hover:bg-[#1a4fc1]"
            onClick={onSearch}
          >
            查 询
          </button>
          <button
            type="button"
            className="h-9 rounded-[6px] border border-[#dcdfe6] bg-white px-5 text-[13px] text-slate-600 hover:bg-slate-50"
            onClick={onReset}
          >
            重 置
          </button>
          <button
            type="button"
            className="h-9 rounded-[6px] bg-[#16a05d] px-5 text-[13px] font-medium text-white hover:bg-[#12864f]"
            onClick={onExport}
          >
            导 出
          </button>
        </div>
      </div>
    </div>
  );
}

function EmergencyClosureToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="inline-flex items-center gap-1.5 text-[12px] text-slate-500"
      title={checked ? "紧急休市已开启" : "开启紧急休市"}
    >
      <span>休市</span>
      <span
        className={`relative inline-block h-[18px] w-[34px] rounded-full transition ${
          checked ? "bg-[#1f5bd8]" : "bg-[#dcdfe6]"
        }`}
      >
        <span
          className={`absolute top-[2px] size-[14px] rounded-full bg-white shadow transition ${
            checked ? "left-[18px]" : "left-[2px]"
          }`}
        />
      </span>
    </button>
  );
}

function Pagination({ total }: { total: number }) {
  return (
    <div className="flex items-center justify-end gap-3 text-[13px] text-slate-600">
      <span>共 {total} 条</span>
      <button type="button" className="grid size-7 place-items-center rounded-[4px] text-slate-400 hover:bg-slate-100">
        <ChevronLeft className="size-3.5" />
      </button>
      <span className="grid size-7 place-items-center rounded-[4px] border border-[#1f5bd8] text-[#1f5bd8]">1</span>
      <button type="button" className="grid size-7 place-items-center rounded-[4px] text-slate-400 hover:bg-slate-100">
        <ChevronRight className="size-3.5" />
      </button>
      <button
        type="button"
        className="flex h-7 items-center gap-1 rounded-[4px] border border-[#dcdfe6] bg-white px-2 text-slate-600"
      >
        10 条/页
        <ChevronDown className="size-3" />
      </button>
    </div>
  );
}

function Modal({
  open,
  onClose,
  title,
  children,
  width = "max-w-[640px]",
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/40 p-4">
      <div className={`w-full ${width} overflow-hidden rounded-[10px] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]`}>
        <div className="flex items-center justify-between border-b border-[#eceff5] px-6 py-4">
          <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="size-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer ? <div className="flex items-center justify-end gap-3 border-t border-[#eceff5] px-6 py-3">{footer}</div> : null}
      </div>
    </div>
  );
}

function TradingTimeConfigDialog({
  open,
  form,
  onChange,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  form: RwaProductTradingConfig;
  onChange: (next: RwaProductTradingConfig) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const updateWindow = (key: keyof RwaProductTradingConfig["tradingWindow"], value: string) => {
    onChange({
      ...form,
      tradingWindow: {
        ...form.tradingWindow,
        [key]: value,
      },
    });
  };

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="设置交易时段"
      width="max-w-[860px]"
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            className="h-9 rounded-[6px] border border-[#dcdfe6] bg-white px-5 text-[13px] text-slate-600 hover:bg-slate-50"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-9 rounded-[6px] bg-[#1f5bd8] px-5 text-[13px] font-medium text-white hover:bg-[#1a4fc1]"
          >
            确定
          </button>
        </>
      }
    >
      <div className="grid grid-cols-[1fr_320px] gap-8">
        <div>
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-[13px] text-slate-700">交易时区</p>
              <button
                type="button"
                className="flex h-10 w-full items-center justify-between rounded-[6px] border border-[#dcdfe6] bg-white px-3 text-[13px] text-slate-700"
              >
                (GMT+1:00) 卢森堡时间
                <ChevronDown className="size-3.5 text-slate-400" />
              </button>
            </div>
            <div>
              <p className="mb-2 text-[13px] text-slate-700">工作日</p>
              <div className="flex flex-wrap gap-2">
                {weekdays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className="h-9 rounded-[6px] border border-[#dcdfe6] bg-white px-4 text-[13px] text-slate-700 hover:border-[#1f5bd8] hover:text-[#1f5bd8]"
                    onClick={() => updateWindow("weekday", day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[13px] text-slate-700">交易时段</p>
              <div className="flex items-center gap-3">
                <input
                  className="h-10 w-[140px] rounded-[6px] border border-[#dcdfe6] px-3 text-center text-[13px] outline-none focus:border-[#1f5bd8]"
                  value={form.tradingWindow.startTime}
                  onChange={(event) => updateWindow("startTime", event.target.value)}
                />
                <span className="text-slate-400">—</span>
                <input
                  className="h-10 w-[140px] rounded-[6px] border border-[#dcdfe6] px-3 text-center text-[13px] outline-none focus:border-[#1f5bd8]"
                  value={form.tradingWindow.endTime}
                  onChange={(event) => updateWindow("endTime", event.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-[8px] border border-[#eceff5] bg-white p-4">
          <p className="text-[13px] font-semibold text-[#1f5bd8] underline underline-offset-2">设置交易时段</p>
          <div className="mt-3 flex items-center justify-between text-[13px] font-medium text-slate-900">
            <span>June 2026</span>
            <span className="flex gap-2 text-slate-400">
              <ChevronLeft className="size-3.5" />
              <ChevronRight className="size-3.5" />
            </span>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-y-2 text-center text-[11px] font-medium text-slate-400">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-y-2 text-center text-[12px] text-slate-700">
            {calendarDays.map((day) => (
              <button
                key={day}
                type="button"
                className={`mx-auto grid size-7 place-items-center rounded-full transition hover:bg-slate-100 ${
                  day === 7 ? "bg-[#1f5bd8] text-white hover:bg-[#1a4fc1]" : ""
                }`}
                onClick={() => updateWindow("day", String(day).padStart(2, "0"))}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-[12px]">
            <span className="text-slate-700">交易时段</span>
            <input
              className="h-7 w-[64px] rounded-[4px] bg-[#f1f1f3] px-2 text-center outline-none"
              value={form.tradingWindow.startTime}
              onChange={(event) => updateWindow("startTime", event.target.value)}
            />
            <span className="text-slate-400">—</span>
            <input
              className="h-7 w-[64px] rounded-[4px] bg-[#f1f1f3] px-2 text-center outline-none"
              value={form.tradingWindow.endTime}
              onChange={(event) => updateWindow("endTime", event.target.value)}
            />
          </div>
          <div className="mt-3 flex justify-center gap-2">
            <button type="button" className="h-7 rounded-[4px] bg-[#1f5bd8] px-3 text-[12px] font-medium text-white">
              应用到全部
            </button>
            <button type="button" className="h-7 rounded-[4px] bg-[#1f5bd8] px-3 text-[12px] font-medium text-white">
              应用到当天
            </button>
          </div>
        </aside>
      </div>
    </Modal>
  );
}

type ProductFormState = {
  symbol: string;
  contract: string;
  productType: ProductRow["productType"];
  productTypeName: string;
  rwaAsset: ProductRow["rwaAsset"];
  sellPrices: StablecoinPrices;
  repurchasePrices: StablecoinPrices;
  enSellPrices: StablecoinPrices;
  enRepurchasePrices: StablecoinPrices;
  totalAmount: string;
  pointCommissionRate: string;
  commissionRate: string;
  totalCommission: string;
  headCommission: string;
  chainNetwork: string;
  bondName: string;
  productLogoImage: string;
  displayMerchant: string;
  underlyingScale: string;
  issuedAmount: string;
  minimumOrder: string;
  tradingRule: string;
  tags: string;
  tagTwo: string;
  tagThree: string;
  description: string;
  detailDescription: string;
  enProductTypeName: string;
  enBondName: string;
  enDisplayMerchant: string;
  enUnderlyingScale: string;
  enMinimumOrder: string;
  enTradingRule: string;
  enTags: string;
  enTagTwo: string;
  enTagThree: string;
  enDescription: string;
  enDetailDescription: string;
  descriptionImages: string[];
  marketMakers: MarketMakerEntry[];
  bondAnnualYield: string;
  baseAnnualRate: string;
  pointAnnualRate: string;
  commissionAnnualRate: string;
  takerFeeRate: string;
  makerFeeRate: string;
  changeNotes: string;
};

type ProductFormTextKey = {
  [Key in keyof ProductFormState]: ProductFormState[Key] extends string ? Key : never;
}[keyof ProductFormState];

const emptyProductForm: ProductFormState = {
  symbol: "",
  contract: "",
  productType: "MONEY_MARKET",
  productTypeName: "",
  rwaAsset: "AUSD",
  sellPrices: defaultStablecoinPrices,
  repurchasePrices: { USDC: "0.9980", USDT: "0.9980", USD1: "0.9980" },
  enSellPrices: blankStablecoinPrices,
  enRepurchasePrices: blankStablecoinPrices,
  totalAmount: "",
  pointCommissionRate: "",
  commissionRate: "",
  totalCommission: "",
  headCommission: "",
  chainNetwork: "BNB Smart Chain-RealFinance支持的公链",
  bondName: "",
  productLogoImage: "",
  displayMerchant: "",
  underlyingScale: "",
  issuedAmount: "",
  minimumOrder: "",
  tradingRule: "",
  tags: "",
  tagTwo: "",
  tagThree: "",
  description: "",
  detailDescription: "",
  enProductTypeName: "",
  enBondName: "",
  enDisplayMerchant: "",
  enUnderlyingScale: "",
  enMinimumOrder: "",
  enTradingRule: "",
  enTags: "",
  enTagTwo: "",
  enTagThree: "",
  enDescription: "",
  enDetailDescription: "",
  descriptionImages: [],
  marketMakers: [defaultMarketMaker],
  bondAnnualYield: "",
  baseAnnualRate: "",
  pointAnnualRate: "",
  commissionAnnualRate: "",
  takerFeeRate: "",
  makerFeeRate: "",
  changeNotes: "",
};

function getEnglishContentFromForm(form: ProductFormState): ProductLocaleContent {
  return {
    productTypeName: form.enProductTypeName,
    bondName: form.enBondName,
    displayMerchant: form.enDisplayMerchant,
    underlyingScale: form.enUnderlyingScale,
    minimumOrder: form.enMinimumOrder,
    tradingRule: form.enTradingRule,
    tags: form.enTags,
    tagTwo: form.enTagTwo,
    tagThree: form.enTagThree,
    description: form.enDescription,
    detailDescription: form.enDetailDescription,
  };
}

function getChineseContentFromForm(form: ProductFormState): ProductLocaleContent {
  return {
    productTypeName: form.productTypeName,
    bondName: form.bondName,
    displayMerchant: form.displayMerchant,
    underlyingScale: form.underlyingScale,
    minimumOrder: form.minimumOrder,
    tradingRule: form.tradingRule,
    tags: form.tags,
    tagTwo: form.tagTwo,
    tagThree: form.tagThree,
    description: form.description,
    detailDescription: form.detailDescription,
  };
}

function getFallbackChineseContent(row: ProductRow): ProductLocaleContent {
  const isMoneyMarket = row.productType === "MONEY_MARKET";
  const marketMakerName = row.marketMakers[0]?.name ?? defaultMarketMaker.name;

  return {
    productTypeName: productTypeLabels[row.productType],
    bondName: row.symbol === "rFUIDL" ? "梅隆银行货币基金" : row.symbol,
    displayMerchant: marketMakerName,
    underlyingScale: isMoneyMarket ? "美元流动性货币基金" : "城投债底层资产",
    minimumOrder: `1 ${row.symbol}`,
    tradingRule: row.symbol === "rFUIDL" ? "工作日买卖 11:00 前当日结算" : "二级市场开放交易",
    tags: productTypeLabels[row.productType],
    tagTwo: isMoneyMarket ? "每日流动性" : "固定收益资产",
    tagThree: "iREAL奖励",
    description: row.description ?? `${row.symbol} ${productTypeLabels[row.productType]}产品`,
    detailDescription: row.description ?? `${row.symbol} ${productTypeLabels[row.productType]}产品详情，支持 Markdown 内容编辑。`,
  };
}

function normalizeRateValue(value?: string) {
  return value?.replace("%", "").trim() ?? "";
}

function inferProductTypeFromName(value: string): ProductRow["productType"] {
  const normalized = value.trim().toLowerCase();
  if (normalized.includes("企业") || normalized.includes("债券") || normalized.includes("corporate") || normalized.includes("bond")) {
    return "CORPORATE_BOND";
  }
  return "MONEY_MARKET";
}

function hasPositiveCompletePrices(prices: StablecoinPrices) {
  return stablecoinTokens.every((token) => {
    const value = Number(prices[token]);
    return Number.isFinite(value) && value > 0;
  });
}

function isEnglishProductConfigured(form: ProductFormState) {
  const requiredTextFields = [
    form.enProductTypeName,
    form.enBondName,
    form.enDisplayMerchant,
    form.enUnderlyingScale,
    form.enMinimumOrder,
    form.enTradingRule,
    form.enTags,
    form.enDescription,
    form.enDetailDescription,
  ];

  return requiredTextFields.every((value) => value.trim() !== "");
}

const localeFieldKeys = {
  zh: {
    productTypeName: "productTypeName",
    bondName: "bondName",
    displayMerchant: "displayMerchant",
    underlyingScale: "underlyingScale",
    minimumOrder: "minimumOrder",
    tradingRule: "tradingRule",
    tags: "tags",
    tagTwo: "tagTwo",
    tagThree: "tagThree",
    description: "description",
    detailDescription: "detailDescription",
  },
  en: {
    productTypeName: "enProductTypeName",
    bondName: "enBondName",
    displayMerchant: "enDisplayMerchant",
    underlyingScale: "enUnderlyingScale",
    minimumOrder: "enMinimumOrder",
    tradingRule: "enTradingRule",
    tags: "enTags",
    tagTwo: "enTagTwo",
    tagThree: "enTagThree",
    description: "enDescription",
    detailDescription: "enDetailDescription",
  },
} satisfies Record<ProductFormLocale, Record<string, ProductFormTextKey>>;

const localeFormCopy = {
  zh: {
    productFieldsTitle: "产品字段",
    logoLabel: "LOGO",
    logoHint: "产品logo像素大小300px*300px；大小1MB；",
    productTypePlaceholder: "输入产品类型，例如：货币基金或者企业债券，不超过6个中文、英文单词",
    productTypeAction: "产品类型",
    bondNamePlaceholder: "展示在交易符号下方的全称，例如：复星财富控股",
    bondNameAction: "债券全称",
    symbolPlaceholder: "交易符号，用户交易和钱包展示资产的符号",
    symbolAction: "交易符号",
    displayMerchantPlaceholder: "卡片的商家名称",
    displayMerchantAction: "展示商家",
    underlyingScalePlaceholder: "底层规模",
    underlyingScaleAction: "底层规模",
    totalAmountPlaceholder: "总供应量",
    totalAmountAction: "总供应量",
    issuedAmountPlaceholder: "已经出售=已出售+手动配置出售数量",
    issuedAmountAction: "已出售",
    minimumOrderPlaceholder: "单笔起购，之后将是单笔起购额的倍数",
    minimumOrderAction: "单笔起购",
    tradingRulePlaceholder: "例如：工作日买卖 11:00 前当日结算",
    tradingRuleAction: "交易时限",
    tagOnePlaceholder: "标签1",
    tagTwoPlaceholder: "标签2",
    tagThreePlaceholder: "标签3",
    confirmAction: "确定",
    descriptionTitle: "简介",
    descriptionPlaceholder: "展示在产品列表卡片的简介内容，不能超过150个字符",
    detailTitle: "详情",
    detailPlaceholder: "展示在产品详情中的内容，不能超过5000个字符，支持 Markdown 和内容换行",
    imageLabel: "图片",
    imageHint: "图片的最佳像素尺寸1500px*400px；大小不超过1MB；",
    sellPriceTitle: "卖出价格",
    buyPriceTitle: "买入价格",
    annualYieldLabel: "预期收益率",
    baseAnnualRateLabel: "基础年化(按月分红)",
    pointAnnualRateLabel: "积分年化(iREAL)",
    commissionAnnualRateLabel: "佣金年化",
    takerFeeLabel: "Taker 手续费（做市方将收取费率，币种是稳定币）",
    takerFeeHint: "用户购买手续费=稳定币实际购买额度*手续费率；用户实际获得代币=(稳定币购买额-手续费)/代币单价。",
    makerFeeLabel: "Maker 手续费（做市方将收取费率，币种是 rToken）",
    makerFeeHint: "用户卖出手续费=卖出代币数量*手续费率；用户实际获得稳定币=代币数量*(1-手续费率)*代币单价。",
    remarkTitle: "产品备注",
    remarkPlaceholder:
      "请按格式填写，例如：\n2026年5月12日 16:00，卖出价格 USDC/USDT/USD1 调整为 1.0008/1.0012/0.9996；买入价格调整为 0.9986/0.9990/0.9978。\n价格变更仅影响之后的新订单。",
  },
  en: {
    productFieldsTitle: "Product Fields",
    logoLabel: "LOGO",
    logoHint: "Logo size 300px * 300px; file size under 1MB;",
    productTypePlaceholder: "Money Market Fund or Corporate Bond",
    productTypeAction: "Product Type",
    bondNamePlaceholder: "BNY Money Market Fund",
    bondNameAction: "Full Name",
    symbolPlaceholder: "Trading symbol shown in wallet and frontend",
    symbolAction: "Symbol",
    displayMerchantPlaceholder: "Provider",
    displayMerchantAction: "Provider",
    underlyingScalePlaceholder: "Underlying AUM: USD 20B+",
    underlyingScaleAction: "Underlying AUM",
    totalAmountPlaceholder: "Total supply",
    totalAmountAction: "Total Supply",
    issuedAmountPlaceholder: "Sold amount, must be less than total supply",
    issuedAmountAction: "Sold",
    minimumOrderPlaceholder: "Min 1 rFUIDL, whole tokens",
    minimumOrderAction: "Min Order",
    tradingRulePlaceholder: "Trade Window: Workdays · before 11:00",
    tradingRuleAction: "Trade Window",
    tagOnePlaceholder: "Exchange-Approved Collateral",
    tagTwoPlaceholder: "Product Liquidity: Daily Buy & Sell",
    tagThreePlaceholder: "Benefits: iREAL Points",
    confirmAction: "Confirm",
    descriptionTitle: "Short Description",
    descriptionPlaceholder: "Short card description, no more than 150 characters",
    detailTitle: "Details",
    detailPlaceholder: "Product details for the product page, Markdown supported, no more than 5000 characters",
    imageLabel: "Image",
    imageHint: "Recommended image size 1500px * 400px; file size under 1MB;",
    sellPriceTitle: "Sell Price",
    buyPriceTitle: "Buy Price",
    annualYieldLabel: "Estimated Yield",
    baseAnnualRateLabel: "Monthly Distribution APY",
    pointAnnualRateLabel: "iREAL Points APY",
    commissionAnnualRateLabel: "Commission APY",
    takerFeeLabel: "Taker Fee (market maker charges this rate in stablecoin)",
    takerFeeHint:
      "User buy fee = stablecoin purchase amount * fee rate; token received = (stablecoin purchase amount - fee) / token price.",
    makerFeeLabel: "Maker Fee (market maker charges this rate in rToken)",
    makerFeeHint:
      "User sell fee = token amount * fee rate; stablecoin received = token amount * (1 - fee rate) * token price.",
    remarkTitle: "Product Notes",
    remarkPlaceholder:
      "Suggested format:\nMay 12, 2026 16:00, sell prices USDC/USDT/USD1 changed to 1.0008/1.0012/0.9996; buy prices changed to 0.9986/0.9990/0.9978.\nPrice changes only affect new orders submitted afterwards.",
  },
} satisfies Record<ProductFormLocale, Record<string, string>>;

const stablecoinTokens = ["USDT", "USDC", "USD1"] as const;

function FieldWithAction({
  label,
  placeholder,
  value,
  onChange,
  actionLabel,
  required,
  requiredMark,
  disabled,
}: {
  label?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  actionLabel: string;
  required?: boolean;
  requiredMark?: boolean;
  disabled?: boolean;
}) {
  const isRequired = required || requiredMark;
  const inputClassName = disabled
    ? "bg-[#f5f7fa] text-[#909399] cursor-not-allowed"
    : "bg-white text-[#303133]";
  const actionClassName = disabled ? "bg-[#c0c4cc] text-white" : "bg-[#2f86f6] text-white";

  return (
    <label className="block">
      {label ? (
        <span className="text-[13px] text-[#303133]">
          {label}
          {isRequired ? <span className="ml-1 text-[#f56c6c]">*</span> : null}
        </span>
      ) : null}
      <div className={`${label ? "mt-2 " : ""}flex items-center`}>
        <div className="flex min-w-0 flex-1">
          <input
            className={`h-10 min-w-0 flex-1 rounded-l-[4px] border border-r-0 border-[#dcdfe6] px-3 text-[13px] outline-none placeholder:text-[#a8b3c1] focus:border-[#1f5bd8] ${inputClassName}`}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
          />
          <span className={`grid h-10 w-[92px] place-items-center rounded-r-[4px] text-[13px] font-medium ${actionClassName}`}>
            {actionLabel}
          </span>
        </div>
        {!label && isRequired ? <span className="ml-2 text-[13px] text-[#f56c6c]">*</span> : null}
      </div>
    </label>
  );
}

function PriceInputRows({
  title,
  prices,
  onChange,
  confirmLabel = "确定",
  required,
}: {
  title: string;
  prices: StablecoinPrices;
  onChange: (token: keyof StablecoinPrices, value: string) => void;
  confirmLabel?: string;
  required?: boolean;
}) {
  return (
    <div>
      <p className="mb-3 text-[13px] font-medium text-[#303133]">
        {title}
        {required ? <span className="ml-1 text-[#f56c6c]">*</span> : null}
      </p>
      <div className="space-y-3">
        {stablecoinTokens.map((token) => (
          <div key={token} className="flex items-center gap-3">
            <input
              className="h-10 min-w-0 flex-1 rounded-l-[4px] border border-[#dcdfe6] bg-white px-3 text-[13px] outline-none placeholder:text-[#a8b3c1] focus:border-[#1f5bd8]"
              placeholder="0.0000"
              value={prices[token]}
              onChange={(event) => onChange(token, event.target.value)}
            />
            <span className="grid h-10 w-[76px] place-items-center bg-[#2f86f6] text-[13px] font-medium text-white">
              {token}
            </span>
            <button
              type="button"
              className="h-10 w-[76px] rounded-[4px] bg-[#2f86f6] text-[13px] font-medium text-white hover:bg-[#1f73df]"
            >
              {confirmLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageUploadBox({
  image,
  label = "LOGO",
  helper,
  onChange,
}: {
  image?: string;
  label?: string;
  helper?: string;
  onChange: (image: string) => void;
}) {
  return (
    <label className="grid size-[84px] cursor-pointer place-items-center rounded-[4px] border border-[#dcdfe6] bg-white text-center text-[12px] text-[#909399] hover:border-[#1f5bd8]">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- 后台本地上传预览使用 dataURL。
        <img src={image} alt={label} className="size-full rounded-[4px] object-cover" />
      ) : (
        <span>
          <span className="block text-[22px] leading-none text-[#bfc5d0]">▧</span>
          <span className="mt-1 block text-[#303133]">{label}</span>
          {helper ? <span className="mt-1 block text-[10px]">{helper}</span> : null}
        </span>
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => onChange(String(reader.result));
          reader.readAsDataURL(file);
        }}
      />
    </label>
  );
}

function ProductFormDialog({
  open,
  title,
  mode,
  form,
  onChange,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  mode: "create" | "edit";
  form: ProductFormState;
  onChange: (next: ProductFormState) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [activeLocale, setActiveLocale] = useState<ProductFormLocale>("zh");

  if (!open) return null;
  const isCreate = mode === "create";
  const lockIdentityFields = mode === "edit";
  const localeKeys = localeFieldKeys[activeLocale];
  const localeCopy = localeFormCopy[activeLocale];
  const updateText = (key: ProductFormTextKey, value: string) => onChange({ ...form, [key]: value });
  const updateLocaleText = (key: keyof typeof localeKeys, value: string) => updateText(localeKeys[key], value);
  const updateDescriptionImage = (index: number, image: string) => {
    const next = [...form.descriptionImages];
    next[index] = image;
    onChange({ ...form, descriptionImages: next });
  };
  const updatePrice = (
    group: "sellPrices" | "repurchasePrices",
    token: keyof StablecoinPrices,
    value: string
  ) => {
    onChange({
      ...form,
      [group]: {
        ...form[group],
        [token]: value,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/45">
      <button
        type="button"
        aria-label="关闭添加产品抽屉遮罩"
        className="absolute inset-0 cursor-default"
        onClick={onCancel}
      />
      <aside className="absolute right-0 top-0 flex h-full w-[720px] max-w-[calc(100vw-220px)] flex-col bg-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
        <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#ebeef5] px-8">
          <h3 className="text-[20px] font-semibold text-[#303133]">{title}</h3>
          <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X className="size-6" />
          </button>
        </header>

        <div className="shrink-0 border-b border-[#ebeef5] px-8 pt-6">
          <div className="flex gap-3 pb-3">
            <button
              type="button"
              className={`h-8 w-[104px] rounded-[3px] text-[13px] font-medium ${
                activeLocale === "zh"
                  ? "bg-[#2f86f6] text-white"
                  : "border border-[#dcdfe6] bg-white text-[#606266]"
              }`}
              onClick={() => setActiveLocale("zh")}
            >
              中文
            </button>
            <button
              type="button"
              className={`h-8 w-[104px] rounded-[3px] text-[13px] font-medium ${
                activeLocale === "en"
                  ? "bg-[#2f86f6] text-white"
                  : "border border-[#dcdfe6] bg-white text-[#606266]"
              }`}
              onClick={() => setActiveLocale("en")}
            >
              英文
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-7">
            {!isCreate ? (
              <p className="rounded-[4px] bg-[#f5f7fa] px-3 py-2 text-[12px] leading-5 text-[#909399]">
                编辑产品时，债券全称和交易符号不可修改，其他字段可继续配置。
              </p>
            ) : null}
            <div className="space-y-7">
              <FieldWithAction
                placeholder={localeCopy.productTypePlaceholder}
                value={form[localeKeys.productTypeName]}
                onChange={(value) => updateLocaleText("productTypeName", value)}
                actionLabel={localeCopy.productTypeAction}
                requiredMark
              />

              <section className="space-y-4">
                <div className="text-[14px] font-semibold text-[#303133]">{localeCopy.productFieldsTitle}</div>
                <div className="space-y-2">
                  <ImageUploadBox
                    image={form.productLogoImage}
                    label={localeCopy.logoLabel}
                    onChange={(image) => updateText("productLogoImage", image)}
                  />
                  <p className="text-[11px] text-[#ff3b30]">
                    <span className="mr-1">*</span>
                    {localeCopy.logoHint}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <FieldWithAction
                    placeholder={localeCopy.bondNamePlaceholder}
                    value={form[localeKeys.bondName]}
                    onChange={(value) => updateLocaleText("bondName", value)}
                    actionLabel={localeCopy.bondNameAction}
                    requiredMark
                    disabled={lockIdentityFields}
                  />
                  <FieldWithAction
                    placeholder={localeCopy.symbolPlaceholder}
                    value={form.symbol}
                    onChange={(value) => updateText("symbol", value)}
                    actionLabel={localeCopy.symbolAction}
                    requiredMark
                    disabled={lockIdentityFields}
                  />
                  <FieldWithAction
                    placeholder={localeCopy.displayMerchantPlaceholder}
                    value={form[localeKeys.displayMerchant]}
                    onChange={(value) => updateLocaleText("displayMerchant", value)}
                    actionLabel={localeCopy.displayMerchantAction}
                    requiredMark
                  />
                  <FieldWithAction
                    placeholder={localeCopy.underlyingScalePlaceholder}
                    value={form[localeKeys.underlyingScale]}
                    onChange={(value) => updateLocaleText("underlyingScale", value)}
                    actionLabel={localeCopy.underlyingScaleAction}
                    requiredMark
                  />
                  <FieldWithAction
                    placeholder={localeCopy.totalAmountPlaceholder}
                    value={form.totalAmount}
                    onChange={(value) => updateText("totalAmount", value)}
                    actionLabel={localeCopy.totalAmountAction}
                    requiredMark
                  />
                  <FieldWithAction
                    placeholder={localeCopy.issuedAmountPlaceholder}
                    value={form.issuedAmount}
                    onChange={(value) => updateText("issuedAmount", value)}
                    actionLabel={localeCopy.issuedAmountAction}
                    requiredMark
                  />
                  <FieldWithAction
                    placeholder={localeCopy.minimumOrderPlaceholder}
                    value={form[localeKeys.minimumOrder]}
                    onChange={(value) => updateLocaleText("minimumOrder", value)}
                    actionLabel={localeCopy.minimumOrderAction}
                    requiredMark
                  />
                  <FieldWithAction
                    placeholder={localeCopy.tradingRulePlaceholder}
                    value={form[localeKeys.tradingRule]}
                    onChange={(value) => updateLocaleText("tradingRule", value)}
                    actionLabel={localeCopy.tradingRuleAction}
                    requiredMark
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <FieldWithAction
                    placeholder={localeCopy.tagOnePlaceholder}
                    value={form[localeKeys.tags]}
                    onChange={(value) => updateLocaleText("tags", value)}
                    actionLabel={localeCopy.confirmAction}
                    requiredMark
                  />
                  <FieldWithAction
                    placeholder={localeCopy.tagTwoPlaceholder}
                    value={form[localeKeys.tagTwo]}
                    onChange={(value) => updateLocaleText("tagTwo", value)}
                    actionLabel={localeCopy.confirmAction}
                  />
                  <FieldWithAction
                    placeholder={localeCopy.tagThreePlaceholder}
                    value={form[localeKeys.tagThree]}
                    onChange={(value) => updateLocaleText("tagThree", value)}
                    actionLabel={localeCopy.confirmAction}
                  />
                </div>
              </section>

              <section className="space-y-3">
                <div className="text-[14px] font-semibold text-[#303133]">
                  {localeCopy.descriptionTitle}
                  <span className="ml-1 text-[#f56c6c]">*</span>
                </div>
                <textarea
                  className="h-[84px] w-full resize-none rounded-[4px] border border-[#dcdfe6] bg-white px-3 py-3 text-[13px] outline-none placeholder:text-[#a8b3c1] focus:border-[#1f5bd8]"
                  placeholder={localeCopy.descriptionPlaceholder}
                  value={form[localeKeys.description]}
                  onChange={(event) => updateLocaleText("description", event.target.value)}
                />
              </section>

              <section className="space-y-3">
                <div className="text-[14px] font-semibold text-[#303133]">
                  {localeCopy.detailTitle}
                  <span className="ml-1 text-[#f56c6c]">*</span>
                </div>
                <textarea
                  className="h-[104px] w-full resize-none rounded-[4px] border border-[#dcdfe6] bg-white px-3 py-3 text-[13px] outline-none placeholder:text-[#a8b3c1] focus:border-[#1f5bd8]"
                  placeholder={localeCopy.detailPlaceholder}
                  value={form[localeKeys.detailDescription]}
                  onChange={(event) => updateLocaleText("detailDescription", event.target.value)}
                />
                <div className="flex gap-4">
                  {[0, 1, 2].map((index) => (
                    <ImageUploadBox
                      key={index}
                      image={form.descriptionImages[index]}
                      label={localeCopy.imageLabel}
                      onChange={(image) => updateDescriptionImage(index, image)}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-[#ff3b30]">
                  <span className="mr-1">*</span>
                  {localeCopy.imageHint}
                </p>
              </section>

              <section className="grid grid-cols-2 gap-6 rounded-[4px] bg-[#f5f5f5] p-5">
                <PriceInputRows
                  title={localeCopy.sellPriceTitle}
                  prices={form.sellPrices}
                  onChange={(token, value) => updatePrice("sellPrices", token, value)}
                  confirmLabel={localeCopy.confirmAction}
                  required
                />
                <PriceInputRows
                  title={localeCopy.buyPriceTitle}
                  prices={form.repurchasePrices}
                  onChange={(token, value) => updatePrice("repurchasePrices", token, value)}
                  confirmLabel={localeCopy.confirmAction}
                  required
                />
              </section>

              <section className="space-y-4">
                {([
                  { key: "bondAnnualYield", label: localeCopy.annualYieldLabel },
                  { key: "baseAnnualRate", label: localeCopy.baseAnnualRateLabel },
                  { key: "pointAnnualRate", label: localeCopy.pointAnnualRateLabel },
                  { key: "commissionAnnualRate", label: localeCopy.commissionAnnualRateLabel },
                ] satisfies Array<{ key: ProductFormTextKey; label: string }>).map(({ key, label }) => (
                  <FieldWithAction
                    key={key}
                    label={label}
                    placeholder="0.0000"
                    value={form[key]}
                    onChange={(value) => updateText(key, value)}
                    actionLabel="%"
                    required
                  />
                ))}
              </section>

              <section className="space-y-4">
                <FieldWithAction
                  label={localeCopy.takerFeeLabel}
                  placeholder="0.0000"
                  value={form.takerFeeRate}
                  onChange={(value) => updateText("takerFeeRate", value)}
                  actionLabel="%"
                  required
                />
                <p className="text-[11px] text-[#ff3b30]">{localeCopy.takerFeeHint}</p>
                <FieldWithAction
                  label={localeCopy.makerFeeLabel}
                  placeholder="0.0000"
                  value={form.makerFeeRate}
                  onChange={(value) => updateText("makerFeeRate", value)}
                  actionLabel="%"
                  required
                />
                <p className="text-[11px] text-[#ff3b30]">{localeCopy.makerFeeHint}</p>
              </section>

              <section className="space-y-3">
                <div className="text-[14px] font-semibold text-[#303133]">{localeCopy.remarkTitle}</div>
                <textarea
                  className="h-[104px] w-full resize-none rounded-[4px] border border-[#dcdfe6] bg-white px-3 py-3 text-[13px] leading-5 outline-none placeholder:text-[#a8b3c1] focus:border-[#1f5bd8]"
                  placeholder={localeCopy.remarkPlaceholder}
                  value={form.changeNotes}
                  onChange={(event) => updateText("changeNotes", event.target.value)}
                />
              </section>
            </div>
          </div>
        </div>

        <footer className="flex h-[72px] shrink-0 items-center justify-center gap-5 border-t border-[#ebeef5] bg-white px-8">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 w-[180px] rounded-[6px] border border-[#dcdfe6] bg-white text-[15px] font-medium text-[#303133] hover:bg-slate-50"
          >
            取 消
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-10 w-[180px] rounded-[6px] bg-[#1f5bd8] text-[15px] font-medium text-white hover:bg-[#1a4fc1]"
          >
            确 定
          </button>
        </footer>
      </aside>
    </div>
  );
}

export function ProductListPage() {
  const { showSuccessToast, showErrorToast } = useGlobalFeedback();
  const [config, setConfig] = useState<RwaProductTradingConfig>(DEFAULT_RWA_PRODUCT_TRADING_CONFIG);
  const [tradingForm, setTradingForm] = useState<RwaProductTradingConfig>(DEFAULT_RWA_PRODUCT_TRADING_CONFIG);
  const [tradingOpen, setTradingOpen] = useState(false);

  const [products, setProducts] = useState<ProductRow[]>(initialProducts);
  const [draftFilters, setDraftFilters] = useState<ProductFilters>({
    productType: "",
    rwaAsset: "",
    startDate: "",
    endDate: "",
  });
  const [appliedFilters, setAppliedFilters] = useState<ProductFilters>(draftFilters);
  const [productDialog, setProductDialog] = useState<{ open: boolean; mode: "create" | "edit"; index?: number }>({
    open: false,
    mode: "create",
  });
  const [productForm, setProductForm] = useState<ProductFormState>(emptyProductForm);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = getRwaProductTradingConfig();
      setConfig(next);
      setTradingForm(next);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const saveTradingConfig = (next: RwaProductTradingConfig) => {
    const saved = saveRwaProductTradingConfig(next);
    setConfig(saved);
    setTradingForm(saved);
  };

  const visibleProducts = useMemo(() => {
    return products
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => {
      if (appliedFilters.productType && item.productType !== appliedFilters.productType) return false;
      if (appliedFilters.rwaAsset && item.rwaAsset !== appliedFilters.rwaAsset) return false;
      const createdDate = item.createdAt.slice(0, 10);
      if (appliedFilters.startDate && createdDate < appliedFilters.startDate) return false;
      if (appliedFilters.endDate && createdDate > appliedFilters.endDate) return false;
      return true;
    });
  }, [appliedFilters, products]);

  const stats = useMemo(() => {
    const visibleRows = visibleProducts.map(({ item }) => item);
    const totalCommission = visibleRows.reduce((sum, item) => sum + parseAmount(item.totalCommission), 0);
    const yesterdayCommission = totalCommission * 0.12;
    const moneyMarketHeldAmount = visibleRows
      .filter((item) => item.productType === "MONEY_MARKET")
      .reduce((sum, item) => sum + parseAmount(item.totalAmount), 0);
    const corporateBondHeldAmount = visibleRows
      .filter((item) => item.productType === "CORPORATE_BOND")
      .reduce((sum, item) => sum + parseAmount(item.totalAmount), 0);
    return [
      { title: "资产数量", value: String(visibleRows.length) },
      {
        title: "货币基金净销售额",
        value: formatAmount(moneyMarketHeldAmount),
        unit: "USDC",
      },
      {
        title: "企业债券净销售额",
        value: formatAmount(corporateBondHeldAmount),
        unit: "USDC",
      },
      { title: "昨日返佣金额", value: formatAmount(yesterdayCommission), unit: "USDC" },
      { title: "总返佣金额", value: formatAmount(totalCommission), unit: "USDC" },
    ];
  }, [visibleProducts]);

  const openCreate = () => {
    setProductForm(emptyProductForm);
    setProductDialog({ open: true, mode: "create" });
  };
  const openEdit = (index: number) => {
    const row = products[index];
    const zh = row.zhContent ?? getFallbackChineseContent(row);
    const english = row.englishContent;
    const isMoneyMarket = row.productType === "MONEY_MARKET";
    setProductForm({
      ...emptyProductForm,
      symbol: row.symbol,
      contract: row.contract,
      productType: row.productType,
      productTypeName: zh.productTypeName,
      rwaAsset: row.rwaAsset,
      sellPrices: row.sellPrices,
      repurchasePrices: row.repurchasePrices,
      enSellPrices: row.sellPrices,
      enRepurchasePrices: row.repurchasePrices,
      totalAmount: row.totalAmount,
      issuedAmount: row.issuedAmount ?? row.totalAmount,
      pointCommissionRate: row.pointCommissionRate,
      commissionRate: row.commissionRate,
      totalCommission: row.totalCommission,
      headCommission: row.headCommission,
      chainNetwork: row.chainNetwork ?? emptyProductForm.chainNetwork,
      bondName: zh.bondName,
      productLogoImage: row.productLogoImage ?? getProductLogoUrl(row.symbol),
      displayMerchant: zh.displayMerchant,
      underlyingScale: zh.underlyingScale,
      minimumOrder: zh.minimumOrder,
      tradingRule: zh.tradingRule,
      tags: zh.tags,
      tagTwo: zh.tagTwo,
      tagThree: zh.tagThree,
      description: zh.description,
      detailDescription: zh.detailDescription,
      descriptionImages: row.descriptionImages ?? [],
      marketMakers: row.marketMakers.length > 0 ? row.marketMakers : [defaultMarketMaker],
      bondAnnualYield: row.bondAnnualYield ?? (isMoneyMarket ? "3.90" : normalizeRateValue(row.commissionRate)),
      baseAnnualRate: row.baseAnnualRate ?? (isMoneyMarket ? "3.80" : normalizeRateValue(row.commissionRate)),
      pointAnnualRate: row.pointAnnualRate ?? normalizeRateValue(row.pointCommissionRate),
      commissionAnnualRate: row.commissionAnnualRate ?? normalizeRateValue(row.commissionRate),
      takerFeeRate: row.takerFeeRate ?? "",
      makerFeeRate: row.makerFeeRate ?? "",
      changeNotes: row.changeNotes ?? "",
      enProductTypeName: english?.productTypeName ?? "",
      enBondName: english?.bondName ?? "",
      enDisplayMerchant: english?.displayMerchant ?? "",
      enUnderlyingScale: english?.underlyingScale ?? "",
      enMinimumOrder: english?.minimumOrder ?? "",
      enTradingRule: english?.tradingRule ?? "",
      enTags: english?.tags ?? "",
      enTagTwo: english?.tagTwo ?? "",
      enTagThree: english?.tagThree ?? "",
      enDescription: english?.description ?? "",
      enDetailDescription: english?.detailDescription ?? "",
    });
    setProductDialog({ open: true, mode: "edit", index });
  };
  const closeProductDialog = () => setProductDialog({ open: false, mode: "create" });
  const validateProductForm = () => {
    if (productDialog.mode === "create") {
      if (
        !productForm.productTypeName.trim() ||
        !productForm.symbol.trim() ||
        !productForm.bondName.trim() ||
        !productForm.displayMerchant.trim() ||
        !productForm.underlyingScale.trim() ||
        !productForm.totalAmount.trim() ||
        !productForm.issuedAmount.trim() ||
        !productForm.minimumOrder.trim() ||
        !productForm.tradingRule.trim() ||
        !productForm.tags.trim() ||
        !productForm.description.trim() ||
        !productForm.detailDescription.trim()
      ) {
        showErrorToast("请完善必填信息");
        return false;
      }

      if (!isEnglishProductConfigured(productForm)) {
        showErrorToast("请配置英文产品");
        return false;
      }
    }

    if (!hasPositiveCompletePrices(productForm.sellPrices) || !hasPositiveCompletePrices(productForm.repurchasePrices)) {
      showErrorToast("请输入有效的中文买入/卖出价格");
      return false;
    }

    return true;
  };

  const submitProductDialog = () => {
    if (!validateProductForm()) return;

    if (productDialog.mode === "create") {
      const id = `2049470${String(Math.floor(Math.random() * 1e6)).padStart(6, "0")}`;
      const productType = inferProductTypeFromName(productForm.productTypeName);
      setProducts((prev) => [
        ...prev,
        {
          id: `${id.slice(0, 6)}...${id.slice(-6)}`,
          contract: productForm.contract || "0x0000...0000",
          symbol: productForm.symbol || "rNEW",
          productType,
          rwaAsset: productForm.rwaAsset,
          sellPrices: productForm.sellPrices,
          repurchasePrices: productForm.repurchasePrices,
          enSellPrices: productForm.sellPrices,
          enRepurchasePrices: productForm.repurchasePrices,
          totalAmount: productForm.totalAmount || "0",
          pointCommissionRate: productForm.pointCommissionRate || "0%",
          commissionRate: productForm.commissionRate || "0%",
          totalCommission: productForm.totalCommission || "0",
          headCommission: productForm.headCommission || "0",
          createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
          emergencyClosed: false,
          marketMakers: productForm.marketMakers,
          productLogoImage: productForm.productLogoImage,
          chainNetwork: productForm.chainNetwork,
          issuedAmount: productForm.issuedAmount,
          bondAnnualYield: productForm.bondAnnualYield,
          baseAnnualRate: productForm.baseAnnualRate,
          pointAnnualRate: productForm.pointAnnualRate,
          commissionAnnualRate: productForm.commissionAnnualRate,
          description: productForm.description,
          descriptionImages: productForm.descriptionImages,
          zhContent: getChineseContentFromForm(productForm),
          englishContent: getEnglishContentFromForm(productForm),
          takerFeeRate: productForm.takerFeeRate,
          makerFeeRate: productForm.makerFeeRate,
          changeNotes: productForm.changeNotes,
        },
      ]);
      showSuccessToast("产品已添加");
    } else if (productDialog.index !== undefined) {
      const idx = productDialog.index;
      setProducts((prev) =>
        prev.map((row, i) =>
          i === idx
            ? {
                ...row,
                contract: productForm.contract || row.contract,
                rwaAsset: productForm.rwaAsset,
                sellPrices: productForm.sellPrices,
                repurchasePrices: productForm.repurchasePrices,
                enSellPrices: productForm.sellPrices,
                enRepurchasePrices: productForm.repurchasePrices,
                totalAmount: productForm.totalAmount || row.totalAmount,
                pointCommissionRate: productForm.pointCommissionRate || row.pointCommissionRate,
                commissionRate: productForm.commissionRate || row.commissionRate,
                totalCommission: productForm.totalCommission || row.totalCommission,
                headCommission: productForm.headCommission || row.headCommission,
                marketMakers: productForm.marketMakers,
                productLogoImage: productForm.productLogoImage,
                chainNetwork: productForm.chainNetwork,
                issuedAmount: productForm.issuedAmount,
                bondAnnualYield: productForm.bondAnnualYield,
                baseAnnualRate: productForm.baseAnnualRate,
                pointAnnualRate: productForm.pointAnnualRate,
                commissionAnnualRate: productForm.commissionAnnualRate,
                description: productForm.description,
                descriptionImages: productForm.descriptionImages,
                zhContent: getChineseContentFromForm(productForm),
                englishContent: getEnglishContentFromForm(productForm),
                takerFeeRate: productForm.takerFeeRate,
                makerFeeRate: productForm.makerFeeRate,
                changeNotes: productForm.changeNotes,
              }
            : row
        )
      );
      showSuccessToast("产品已更新");
    }
    closeProductDialog();
  };

  const toggleEmergency = (index: number) => {
    setProducts((prev) =>
      prev.map((row, i) => (i === index ? { ...row, emergencyClosed: !row.emergencyClosed } : row))
    );
    const next = !products[index].emergencyClosed;
    if (products[index].symbol === "rFUIDL") {
      saveTradingConfig({ ...config, emergencyClosed: next });
    }
    showSuccessToast(next ? `已开启 ${products[index].symbol} 紧急休市` : `已关闭 ${products[index].symbol} 紧急休市`);
  };

  const removeProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
    showSuccessToast("已下架");
  };

  const resetFilters = () => {
    const emptyFilters: ProductFilters = {
      productType: "",
      rwaAsset: "",
      startDate: "",
      endDate: "",
    };
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const exportProducts = () => {
    const headers = [
      "产品 ID",
      "合约地址",
      "交易符号",
      "产品类型",
      "中文卖出价格",
      "中文回购价格",
      "英文卖出价格",
      "英文回购价格",
      "用户持有数量",
      "积分佣金比率",
      "佣金比率",
      "总佣金",
      "人头佣金",
      "创建时间",
    ];
    const rows = visibleProducts.map(({ item: row }) => [
      row.id,
      row.contract,
      row.symbol,
      productTypeLabels[row.productType],
      `USDC:${row.sellPrices.USDC} USDT:${row.sellPrices.USDT} USD1:${row.sellPrices.USD1}`,
      `USDC:${row.repurchasePrices.USDC} USDT:${row.repurchasePrices.USDT} USD1:${row.repurchasePrices.USD1}`,
      `USDC:${row.enSellPrices.USDC || "-"} USDT:${row.enSellPrices.USDT || "-"} USD1:${row.enSellPrices.USD1 || "-"}`,
      `USDC:${row.enRepurchasePrices.USDC || "-"} USDT:${row.enRepurchasePrices.USDT || "-"} USD1:${row.enRepurchasePrices.USD1 || "-"}`,
      row.totalAmount,
      row.pointCommissionRate,
      row.commissionRate,
      row.totalCommission,
      row.headCommission,
      row.createdAt,
    ]);
    const csv = [headers, ...rows]
      .map((items) => items.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "产品列表.csv";
    link.click();
    window.URL.revokeObjectURL(url);
    showSuccessToast("导出成功");
  };

  return (
    <div className="space-y-4">
      <FilterBar
        filters={draftFilters}
        onChange={setDraftFilters}
        onSearch={() => setAppliedFilters(draftFilters)}
        onReset={resetFilters}
        onExport={exportProducts}
      />

      <div className="grid grid-cols-5 gap-4">
        {stats.map((item) => (
          <StatCard key={item.title} title={item.title} value={item.value} unit={item.unit} />
        ))}
      </div>

      <div className="rounded-[8px] border border-[#eceff5] bg-white">
        <div className="flex items-center justify-between border-b border-[#eceff5] px-5 py-3">
          <div className="text-[13px] font-medium text-slate-700">产品列表</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCreate}
              className="h-8 rounded-[6px] bg-[#1f5bd8] px-4 text-[13px] font-medium text-white hover:bg-[#1a4fc1]"
            >
              添加产品
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1800px] table-fixed border-collapse text-[13px]">
            <colgroup>
              <col className="w-[120px]" />
              <col className="w-[140px]" />
              <col className="w-[110px]" />
              <col className="w-[120px]" />
              <col className="w-[190px]" />
              <col className="w-[190px]" />
              <col className="w-[140px]" />
              <col className="w-[120px]" />
              <col className="w-[100px]" />
              <col className="w-[100px]" />
              <col className="w-[100px]" />
              <col className="w-[160px]" />
              <col className="w-[230px]" />
            </colgroup>
            <thead className="bg-[#fafbfd] text-left text-slate-500">
              <tr>
                {[
                  "产品 ID",
                  "合约地址",
                  "交易符号",
                  "产品类型",
                  "卖出价格\nUSDC/USDT/USD1",
                  "回购价格\nUSDC/USDT/USD1",
                  "用户持有数量",
                  "积分佣金比率",
                  "佣金比率",
                  "总佣金",
                  "人头佣金",
                  "创建时间",
                  "操作",
                ].map(
                  (title) => (
                    <th key={title} className="h-10 whitespace-pre-line px-4 font-normal">
                      {title}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map(({ item: row, index }) => (
                <tr key={`${row.id}-${row.contract}-${index}`} className="border-t border-[#eceff5] text-slate-700">
                  <td className="px-4 py-3">{row.id}</td>
                  <td className="px-4 py-3 text-[#1f5bd8]">{row.contract}</td>
                  <td className="px-4 py-3">{row.symbol}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-[4px] px-2 py-1 text-[12px] ${
                        row.productType === "MONEY_MARKET"
                          ? "bg-[#d9f7ea] text-[#0f9f61]"
                          : "bg-[#e8f1ff] text-[#1f5bd8]"
                      }`}
                    >
                      {productTypeLabels[row.productType]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <PriceStack prices={row.sellPrices} />
                  </td>
                  <td className="px-4 py-3">
                    <PriceStack prices={row.repurchasePrices} />
                  </td>
                  <td className="px-4 py-3">{row.totalAmount}</td>
                  <td className="px-4 py-3">{row.pointCommissionRate}</td>
                  <td className="px-4 py-3">{row.commissionRate}</td>
                  <td className="px-4 py-3">{row.totalCommission}</td>
                  <td className="px-4 py-3">{row.headCommission}</td>
                  <td className="px-4 py-3">{row.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button type="button" className="text-[#1f5bd8] hover:underline" onClick={() => openEdit(index)}>
                        编辑
                      </button>
                      <button type="button" className="text-slate-500 hover:text-slate-700" onClick={() => removeProduct(index)}>
                        下架
                      </button>
                      <EmergencyClosureToggle
                        checked={row.emergencyClosed}
                        onChange={() => toggleEmergency(index)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#eceff5] px-5 py-3">
          <Pagination total={visibleProducts.length} />
        </div>
      </div>

      <TradingTimeConfigDialog
        open={tradingOpen}
        form={tradingForm}
        onChange={setTradingForm}
        onCancel={() => {
          setTradingForm(config);
          setTradingOpen(false);
        }}
        onConfirm={() => {
          saveTradingConfig(tradingForm);
          setTradingOpen(false);
          showSuccessToast("交易时段已保存");
        }}
      />

      <ProductFormDialog
        key={`${productDialog.open ? "open" : "closed"}-${productDialog.mode}-${productDialog.index ?? "new"}`}
        open={productDialog.open}
        title={productDialog.mode === "create" ? "添加产品" : "编辑产品"}
        mode={productDialog.mode}
        form={productForm}
        onChange={setProductForm}
        onCancel={closeProductDialog}
        onConfirm={submitProductDialog}
      />
    </div>
  );
}
