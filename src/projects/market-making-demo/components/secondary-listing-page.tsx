"use client";

import { useMemo, useState } from "react";
import { ChevronDown, X } from "lucide-react";

import { useGlobalFeedback } from "@/components/feedback/global-feedback-provider";
import { REPURCHASE_LISTING_MOCK_DATA } from "@/projects/market-making-demo/lib/mock-data";

type ListingPageType = "REPURCHASE_LISTING" | "RECOVERY_LISTING";
type ListingType = "OFFICIAL_MARKET_MAKER_CHANGE" | "SECONDARY_MERCHANT_LISTING";
type QuoteStatus = "ONLINE" | "OFFLINE";

type SecondaryListingQuote = {
  id: string;
  originalProductName: string;
  productType: "货币基金" | "企业债券";
  productFullName: string;
  tradingSymbol: string;
  listingPage: ListingPageType;
  listingType: ListingType;
  merchantName: string;
  marketMakerName: string;
  marketMakerAddress: string;
  quotePrice: string;
  availableAmount: number;
  totalAmount: number;
  remainingAmount: number;
  filledAmount: number;
  status: QuoteStatus;
  updatedAt: string;
};

const listingTabs: Array<{ value: ListingPageType; label: string; actionLabel: string }> = [
  { value: "REPURCHASE_LISTING", label: "回购上架", actionLabel: "上架配置" },
  { value: "RECOVERY_LISTING", label: "回收上架", actionLabel: "回收配置" },
];

const listingTypeLabels: Record<ListingType, string> = {
  OFFICIAL_MARKET_MAKER_CHANGE: "官方做市商变更",
  SECONDARY_MERCHANT_LISTING: "二次商家上架",
};

const priceCurrencies = ["USDC", "USDT", "USD1"] as const;

const baseControlClassName =
  "h-8 w-full rounded-[4px] border border-[#dcdfe6] bg-white text-[14px] font-normal text-[#606266] outline-none shadow-[inset_0_1px_1px_rgba(0,0,0,0.02)] transition placeholder:text-[#c0c4cc] disabled:cursor-not-allowed disabled:bg-[#f5f7fa] disabled:text-[#c0c4cc]";
const outlineButtonClassName =
  "h-8 rounded-[4px] border border-[#dcdfe6] bg-white text-[15px] font-semibold leading-8 text-[#303133] shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition hover:border-[#c6e2ff] hover:bg-white";
const primaryButtonClassName =
  "h-8 rounded-[4px] bg-[#2b58d8] text-[15px] font-semibold leading-8 text-white shadow-[0_1px_2px_rgba(43,88,216,0.22)] transition hover:bg-[#2b58d8]";

const recoveryQuoteRows: SecondaryListingQuote[] = [
  {
    id: "rq-10001",
    originalProductName: "rFUIDL复星财富控股",
    productType: "货币基金",
    productFullName: "复星财富控股货币基金",
    tradingSymbol: "rFUIDL",
    listingPage: "RECOVERY_LISTING",
    listingType: "OFFICIAL_MARKET_MAKER_CHANGE",
    merchantName: "REAL Liquidity Provider",
    marketMakerName: "REAL Liquidity Provider",
    marketMakerAddress: "0x8b6F...e9C3",
    quotePrice: "USDC 0.9986 / USDT 0.9990 / USD1 0.9978",
    availableAmount: 72000,
    totalAmount: 18000,
    remainingAmount: 12000,
    filledAmount: 6000,
    status: "ONLINE",
    updatedAt: "2026-05-12 16:00:00",
  },
  {
    id: "rq-10002",
    originalProductName: "rSDCT商都城投",
    productType: "企业债券",
    productFullName: "商都城投企业债券",
    tradingSymbol: "rSDCT",
    listingPage: "RECOVERY_LISTING",
    listingType: "SECONDARY_MERCHANT_LISTING",
    merchantName: "二次商家 Beta",
    marketMakerName: "做市商Beta",
    marketMakerAddress: "0x3bd2...c54e",
    quotePrice: "USDC 0.9916 / USDT 0.9932 / USD1 0.9950",
    availableAmount: 54000,
    totalAmount: 12000,
    remainingAmount: 0,
    filledAmount: 12000,
    status: "OFFLINE",
    updatedAt: "2026-05-13 10:24:18",
  },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(value);
}

function getAssetFullName(symbol: string) {
  if (symbol === "rFUIDL") return "复星财富控股货币基金";
  if (symbol === "rXWCT") return "兴尉城投企业债券";
  if (symbol === "rSDCT") return "商都城投企业债券";
  return `${symbol} 原产品`;
}

function getTradingSymbol(assetName: string) {
  const match = assetName.match(/^r[A-Z0-9]+/);
  return match?.[0] ?? assetName;
}

function getProductType(symbol: string): SecondaryListingQuote["productType"] {
  return symbol === "rFUIDL" ? "货币基金" : "企业债券";
}

function toRepurchaseListings(): SecondaryListingQuote[] {
  return REPURCHASE_LISTING_MOCK_DATA.map((record, index) => {
    const tradingSymbol = getTradingSymbol(record.assetName);
    const remainingAmount = Math.max(record.listedQuantity - record.soldQuantity, 0);

    return {
      id: record.id,
      originalProductName: record.assetName,
      productType: getProductType(tradingSymbol),
      productFullName: getAssetFullName(tradingSymbol),
      tradingSymbol,
      listingPage: "REPURCHASE_LISTING",
      listingType: index === 0 ? "OFFICIAL_MARKET_MAKER_CHANGE" : "SECONDARY_MERCHANT_LISTING",
      merchantName: index === 0 ? "REAL Liquidity Provider" : `二次商家 ${index + 1}`,
      marketMakerName: record.marketMakerName,
      marketMakerAddress: index === 0 ? "0x8b6F...e9C3" : index === 1 ? "0x3bd2...c54e" : "0x48bf...eb6f",
      quotePrice: record.listedPrices.map((item) => `${item.stablecoin} ${item.price.toFixed(4)}`).join(" / "),
      availableAmount: record.availableQuantity,
      totalAmount: record.listedQuantity,
      remainingAmount,
      filledAmount: record.soldQuantity,
      status: record.status,
      updatedAt: record.updatedAt,
    };
  });
}

function SelectBox({
  value,
  placeholder,
  disabled = false,
  className = "",
  options = [],
  onChange,
}: {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  options?: { value: string; label: string }[];
  onChange?: (value: string) => void;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value ?? ""}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        className={`${baseControlClassName} appearance-none px-[11px] pr-9`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#bdbdbd]" />
    </div>
  );
}

function FieldLabel({ children, required = false }: { children: string; required?: boolean }) {
  return (
    <label className="block text-[14px] font-semibold leading-[20px] text-[#303133]">
      {required ? <span className="mr-1 text-[#f05b5b]">*</span> : null}
      {children}
    </label>
  );
}

function TextInput({
  value,
  placeholder,
  disabled = false,
}: {
  value?: string;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <input
      value={value ?? ""}
      disabled={disabled}
      onChange={() => undefined}
      placeholder={placeholder}
      className={`${baseControlClassName} px-[11px] text-[#303133]`}
    />
  );
}

function ProductLogoPreview() {
  return (
    <div className="grid size-[104px] place-items-center rounded-[7px] border border-[#dcdfe6] bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element -- 后台预览远程 token logo，保持和产品配置页一致。 */}
      <img
        src="https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rFUIDL.png"
        alt="rFUIDL LOGO"
        className="size-[82px] rounded-full object-contain"
      />
    </div>
  );
}

function getInitialPageType(fallback: ListingPageType) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const tab = new URLSearchParams(window.location.search).get("tab");

  if (tab === "recovery") {
    return "RECOVERY_LISTING";
  }
  if (tab === "repurchase") {
    return "REPURCHASE_LISTING";
  }

  return fallback;
}

function getInitialConfigOpen(fallback: boolean) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const config = new URLSearchParams(window.location.search).get("config");

  return config === "1" || config === "open" || fallback;
}

function EmptyState() {
  return (
    <div className="flex h-[148px] flex-col items-center justify-center text-[#bcbec3]">
      <div className="relative h-[78px] w-[92px]">
        <div className="absolute bottom-[8px] left-[16px] h-[38px] w-[64px] rounded-b-[6px] bg-[#e4e8ee]" />
        <div className="absolute bottom-[38px] left-[20px] h-0 w-0 border-b-[22px] border-l-[18px] border-r-[18px] border-b-[#edf0f4] border-l-transparent border-r-transparent" />
        <div className="absolute left-[28px] top-[14px] h-[44px] w-[36px] rounded-[2px] bg-[#f3f5f8] shadow-[0_0_0_6px_#edf0f4]">
          <div className="mx-[5px] mt-[10px] h-[11px] bg-[#dfe4eb]" />
          <div className="mx-[5px] mt-[8px] h-[4px] bg-[#e1e5ec]" />
        </div>
        <div className="absolute bottom-0 left-[8px] h-[7px] w-[78px] rounded-full bg-[#f1f3f6]" />
      </div>
      <div className="-mt-1 text-[14px]">暂无数据</div>
    </div>
  );
}

function FilterCard({
  activePageType,
}: {
  activePageType: ListingPageType;
}) {
  return (
    <section className="rounded-[4px] bg-white shadow-[0_2px_12px_0_rgba(0,0,0,0.06)]">
      <div className="flex min-h-[72px] flex-wrap items-center gap-x-[24px] gap-y-3 px-5 py-4">
        <div className="flex items-center gap-4">
          <span className="whitespace-nowrap text-[15px] font-semibold text-[#303133]">资产名称</span>
          <SelectBox placeholder="请选择" className="w-[213px]" />
        </div>
        <div className="flex items-center gap-4">
          <span className="whitespace-nowrap text-[15px] font-semibold text-[#303133]">商家名称</span>
          <SelectBox placeholder="请选择" className="w-[220px]" />
        </div>
        <div className="flex items-center gap-4">
          <span className="whitespace-nowrap text-[15px] font-semibold text-[#303133]">上架类型</span>
          <SelectBox
            placeholder="请选择"
            className="w-[220px]"
            options={[
              { value: "OFFICIAL_MARKET_MAKER_CHANGE", label: "官方做市商变更" },
              { value: "SECONDARY_MERCHANT_LISTING", label: "二次商家上架" },
            ]}
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="whitespace-nowrap text-[15px] font-semibold text-[#303133]">状态</span>
          <SelectBox
            placeholder="请选择"
            className="w-[160px]"
            options={[
              { value: "ONLINE", label: activePageType === "REPURCHASE_LISTING" ? "上架中" : "回收中" },
              { value: "OFFLINE", label: "已下架" },
            ]}
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" className={`${outlineButtonClassName} w-16`}>
            重 置
          </button>
          <button type="button" className={`${primaryButtonClassName} w-16`}>
            查 询
          </button>
        </div>
      </div>
    </section>
  );
}

function getStatusLabel(row: SecondaryListingQuote) {
  if (row.status === "ONLINE") {
    return row.listingPage === "REPURCHASE_LISTING" ? "上架中" : "回收中";
  }
  if (row.remainingAmount <= 0 && row.totalAmount > 0) {
    return row.listingPage === "REPURCHASE_LISTING" ? "已售罄" : "已回收完";
  }
  return "已下架";
}

function QuoteTable({
  rows,
  activePageType,
  onOpenConfig,
}: {
  rows: SecondaryListingQuote[];
  activePageType: ListingPageType;
  onOpenConfig: () => void;
}) {
  const amountLabels =
    activePageType === "REPURCHASE_LISTING"
      ? { available: "可上架", total: "上架总量", remaining: "在售", filled: "已售", price: "上架价格" }
      : { available: "可回收额度", total: "回收总量", remaining: "剩余可回收", filled: "已回收", price: "回收价格" };
  const activeTab = listingTabs.find((tab) => tab.value === activePageType) ?? listingTabs[0];
  const columns = [
    "做市商",
    "资产名称",
    "交易符号",
    "上架类型",
    "做市地址",
    amountLabels.available,
    amountLabels.total,
    amountLabels.remaining,
    amountLabels.filled,
    amountLabels.price,
    "状态",
    "更新时间",
    "操作",
  ];

  return (
    <section className="mt-4 min-h-[360px] rounded-[4px] bg-white shadow-[0_2px_12px_0_rgba(0,0,0,0.07)]">
      <div className="px-5 pb-10 pt-[24px]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[15px] font-semibold text-[#303133]">产品二次上架列表</p>
          </div>
          <button
            type="button"
            onClick={onOpenConfig}
            className="h-[36px] rounded-[6px] bg-[#2b58d8] px-4 text-[15px] font-semibold leading-9 text-white shadow-[0_0_0_4px_rgba(47,128,237,0.28),0_1px_2px_rgba(43,88,216,0.18)] transition hover:bg-[#2b58d8]"
          >
            {activeTab.actionLabel}
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1800px] border-collapse text-left">
            <thead>
              <tr className="h-[47px] bg-[#fbfbfb] text-[14px] font-semibold text-[#1f2329]">
                {columns.map((column) => (
                  <th key={column} className="border-b border-[#ececec] px-2 font-semibold">
                    <span className="block border-r border-[#ececec] leading-[22px] last:border-r-0">{column}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <tr key={row.id} className="h-[58px] text-[13px] text-[#606266]">
                    <td className="border-b border-[#ececec] px-2">{row.merchantName}</td>
                    <td className="border-b border-[#ececec] px-2 font-medium text-[#303133]">{row.originalProductName}</td>
                    <td className="border-b border-[#ececec] px-2">{row.tradingSymbol}</td>
                    <td className="border-b border-[#ececec] px-2">{listingTypeLabels[row.listingType]}</td>
                    <td className="border-b border-[#ececec] px-2 font-mono text-[12px]">{row.marketMakerAddress}</td>
                    <td className="border-b border-[#ececec] px-2">{formatNumber(row.availableAmount)}</td>
                    <td className="border-b border-[#ececec] px-2">{formatNumber(row.totalAmount)}</td>
                    <td className="border-b border-[#ececec] px-2">{formatNumber(row.remainingAmount)}</td>
                    <td className="border-b border-[#ececec] px-2">{formatNumber(row.filledAmount)}</td>
                    <td className="border-b border-[#ececec] px-2">{row.quotePrice}</td>
                    <td className="border-b border-[#ececec] px-2">{getStatusLabel(row)}</td>
                    <td className="border-b border-[#ececec] px-2">{row.updatedAt}</td>
                    <td className="border-b border-[#ececec] px-2 text-[#2b58d8]">编辑</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="border-b border-[#ececec]">
                    <EmptyState />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function ConfigModal({
  open,
  activePageType,
  onClose,
}: {
  open: boolean;
  activePageType: ListingPageType;
  onClose: () => void;
}) {
  const { showWarningToast } = useGlobalFeedback();
  const [listingType, setListingType] = useState<ListingType>("OFFICIAL_MARKET_MAKER_CHANGE");

  if (!open) {
    return null;
  }

  const isRecovery = activePageType === "RECOVERY_LISTING";
  const activeTab = listingTabs.find((tab) => tab.value === activePageType) ?? listingTabs[0];
  const amountLabel = isRecovery ? "回收总量" : "上架总量";
  const priceLabel = isRecovery ? "回收价格" : "上架价格";
  const confirmLabel = "确定";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/48 pt-[72px]">
      <div className="relative flex h-[690px] w-[640px] flex-col rounded-[5px] bg-white shadow-[0_20px_48px_rgba(0,0,0,0.18)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-[20px] top-[21px] grid size-7 place-items-center text-[#909399]"
          aria-label="关闭"
        >
          <X className="size-5 stroke-[2]" />
        </button>

        <div className="px-12 pt-[34px]">
          <h2 className="text-[20px] font-semibold leading-[28px] text-[#303133]">{activeTab.actionLabel}</h2>
        </div>
        <div className="mx-6 mt-3 h-px bg-[#e9e9e9]" />

        <div className="min-h-0 flex-1 overflow-y-auto px-12 py-[22px]">
          <div className="space-y-5">
            <section className="space-y-5">
              <div className="space-y-[8px]">
                <FieldLabel required>产品信息</FieldLabel>
                <SelectBox
                  value="MONEY_MARKET"
                  placeholder="请选择产品类型"
                  options={[{ value: "MONEY_MARKET", label: "货币基金" }]}
                />
              </div>

              <div className="space-y-[8px]">
                <FieldLabel required>LOGO</FieldLabel>
                <ProductLogoPreview />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-[8px]">
                  <FieldLabel required>交易符号</FieldLabel>
                  <SelectBox
                    value="rFUIDL"
                    placeholder="请选择交易符号"
                    options={[{ value: "rFUIDL", label: "rFUIDL" }]}
                  />
                </div>
                <div className="space-y-[8px]">
                  <FieldLabel required>债券全称</FieldLabel>
                  <TextInput value="梅隆银行货币基金" placeholder="债券全称" disabled />
                </div>
              </div>
            </section>

            <div className="text-[14px] font-semibold text-[#303133]">二次上架信息</div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-[8px]">
                <FieldLabel required>上架类型</FieldLabel>
                <SelectBox
                  value={listingType}
                  placeholder="请选择上架类型"
                  options={[
                    { value: "OFFICIAL_MARKET_MAKER_CHANGE", label: "官方做市商变更" },
                    { value: "SECONDARY_MERCHANT_LISTING", label: "二次商家上架" },
                  ]}
                  onChange={(value) => setListingType(value as ListingType)}
                />
              </div>
              <div className="space-y-[8px]">
                <FieldLabel required>商家名称</FieldLabel>
                <SelectBox placeholder="请选择" options={[{ value: "real", label: "REAL Liquidity Provider" }]} />
              </div>
              {listingType === "SECONDARY_MERCHANT_LISTING" ? (
                <div className="col-span-2 rounded-[4px] border border-[#ffe7ba] bg-[#fff7e6] px-3 py-2 text-[12px] leading-5 text-[#ad6800]">
                  该类型会在前台展示第三方商家报价提示，请确认商家信息、价格及交易条件。
                </div>
              ) : null}
              <div className="col-span-2 space-y-[8px]">
                <FieldLabel required>做市地址</FieldLabel>
                <TextInput placeholder="请输入做市地址" />
              </div>
              <div className="col-span-2 space-y-[8px]">
                <FieldLabel required>{amountLabel}</FieldLabel>
                <TextInput placeholder={`请输入${amountLabel}`} />
              </div>
              <div className="col-span-2 space-y-[8px]">
                <FieldLabel required>{`配置${priceLabel}`}</FieldLabel>
                <div className="space-y-2 rounded-[4px] border border-[#ebeef5] bg-[#fbfcff] p-3">
                  {priceCurrencies.map((currency) => (
                    <div key={currency} className="grid grid-cols-[minmax(0,1fr)_56px] items-center gap-3">
                      <TextInput placeholder={`请输入${currency}${priceLabel}`} />
                      <span className="text-[14px] font-semibold leading-8 text-[#606266]">{currency}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e9e9e9] px-12 py-[21px]">
          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className={`${outlineButtonClassName} w-16`}>
              取 消
            </button>
            <button
              type="button"
              onClick={() => showWarningToast("请先连接钱包")}
              className={`${outlineButtonClassName} w-[88px]`}
            >
              连接钱包
            </button>
            <button
              type="button"
              onClick={() => showWarningToast(`请完善${activeTab.actionLabel}`)}
              className={`${primaryButtonClassName} w-[104px]`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SecondaryListingPage({
  initialPageType = "REPURCHASE_LISTING",
  initialConfigOpen = false,
}: {
  initialPageType?: ListingPageType;
  initialConfigOpen?: boolean;
}) {
  const [activePageType, setActivePageType] = useState<ListingPageType>(() => getInitialPageType(initialPageType));
  const [configOpen, setConfigOpen] = useState(() => getInitialConfigOpen(initialConfigOpen));
  const rows = useMemo(
    () => (activePageType === "REPURCHASE_LISTING" ? toRepurchaseListings() : recoveryQuoteRows),
    [activePageType]
  );

  return (
    <div className="w-full">
      <div className="mb-[10px] flex items-center gap-[10px] text-[15px] font-semibold leading-[22px]">
        <span className="text-[#909399]">产品二次上架</span>
        <span className="text-[#909399]">/</span>
        <span className="text-[#303133]">{activePageType === "REPURCHASE_LISTING" ? "回购上架" : "回收上架"}</span>
      </div>

      <div className="mb-3 flex items-center gap-2">
        {listingTabs.map((tab) => {
          const active = tab.value === activePageType;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActivePageType(tab.value)}
              className={`h-9 rounded-[4px] px-5 text-[15px] font-semibold transition ${
                active
                  ? "bg-[#2b58d8] text-white shadow-[0_1px_2px_rgba(43,88,216,0.22)]"
                  : "border border-[#dcdfe6] bg-white text-[#606266] hover:border-[#c6e2ff]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <FilterCard activePageType={activePageType} />
      <QuoteTable rows={rows} activePageType={activePageType} onOpenConfig={() => setConfigOpen(true)} />
      <ConfigModal open={configOpen} activePageType={activePageType} onClose={() => setConfigOpen(false)} />
    </div>
  );
}
