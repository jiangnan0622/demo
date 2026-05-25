"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, X } from "lucide-react";

import { useGlobalFeedback } from "@/components/feedback/global-feedback-provider";
import type {
  RecoveryAssetOption,
  RecoveryListingQuery,
  RecoveryListingRecord,
  RecoveryPriceCurrency,
  RecoveryListingStatus,
} from "@/projects/market-making-demo/lib/recovery-types";
import {
  createDefaultRecoveryQuery,
  getRecoveryAssets,
  getRecoveryCurrentViewer,
  queryRecoveryListings,
  saveRecoveryListing,
} from "@/projects/market-making-demo/services/recovery-listing.service";

const MARKET_MAKER_NAME = "REAL Liquidity Provider";
const baseControlClassName =
  "h-8 w-full rounded-[4px] border border-[#dcdfe6] bg-white text-[14px] font-normal text-[#c0c4cc] outline-none shadow-[inset_0_1px_1px_rgba(0,0,0,0.02)] transition placeholder:text-[#c0c4cc] disabled:cursor-not-allowed disabled:bg-[#f5f7fa] disabled:text-[#c0c4cc]";
const outlineButtonClassName =
  "h-8 rounded-[4px] border border-[#dcdfe6] bg-white text-[15px] font-semibold leading-8 text-[#303133] shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition hover:border-[#c6e2ff] hover:bg-white";
const primaryButtonClassName =
  "h-8 rounded-[4px] bg-[#2b58d8] text-[15px] font-semibold leading-8 text-white shadow-[0_1px_2px_rgba(43,88,216,0.22)] transition hover:bg-[#2b58d8]";

const statusOptions: { value: "ALL" | RecoveryListingStatus; label: string }[] = [
  { value: "ALL", label: "全部状态" },
  { value: "ONLINE", label: "回收中" },
  { value: "OFFLINE", label: "已下架" },
];
const priceCurrencies: RecoveryPriceCurrency[] = ["USDT", "USDC", "USD1"];
const defaultRecoveryPrices: Record<RecoveryPriceCurrency, string> = {
  USDT: "",
  USDC: "",
  USD1: "",
};

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
        {value && !options.some((option) => option.value === value) ? <option value={value}>{value}</option> : null}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#bdbdbd]" />
    </div>
  );
}

function FormLabel({ children, required = false }: { children: string; required?: boolean }) {
  return (
    <label className="block text-[15px] font-semibold leading-[22px] text-[#303133]">
      {required ? <span className="mr-1 text-[#f05b5b]">*</span> : null}
      {children}
    </label>
  );
}

function TextInput({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={`${baseControlClassName} px-[11px] text-[#303133]`}
    />
  );
}

function EmptyState({ loading }: { loading: boolean }) {
  if (loading) {
    return (
      <div className="flex h-[148px] items-center justify-center text-[14px] text-[#bcbec3]">
        加载中
      </div>
    );
  }

  return (
    <div className="flex h-[148px] flex-col items-center justify-center text-[#bcbec3]">
      <div className="relative h-[78px] w-[92px]">
        <div className="absolute bottom-[8px] left-[16px] h-[38px] w-[64px] rounded-b-[6px] bg-[#e4e8ee]" />
        <div className="absolute bottom-[38px] left-[20px] h-0 w-0 border-b-[22px] border-l-[18px] border-r-[18px] border-b-[#edf0f4] border-l-transparent border-r-transparent" />
        <div className="absolute bottom-[38px] right-[12px] h-0 w-0 border-b-[22px] border-l-[18px] border-r-[18px] border-b-[#edf0f4] border-l-transparent border-r-transparent" />
        <div className="absolute left-[28px] top-[14px] h-[44px] w-[36px] rounded-[2px] bg-[#f3f5f8] shadow-[0_0_0_6px_#edf0f4]">
          <div className="mx-[5px] mt-[10px] h-[11px] bg-[#dfe4eb]" />
          <div className="mx-[5px] mt-[8px] h-[4px] bg-[#e1e5ec]" />
          <div className="mx-[5px] mt-[5px] h-[4px] bg-[#e1e5ec]" />
        </div>
        <div className="absolute right-[4px] top-[1px] flex h-[22px] w-[28px] items-center justify-center rounded-full bg-[#e5e9ef]">
          <span className="mb-[3px] text-[17px] leading-none text-white">...</span>
        </div>
        <div className="absolute bottom-0 left-[8px] h-[7px] w-[78px] rounded-full bg-[#f1f3f6]" />
      </div>
      <div className="-mt-1 text-[14px]">暂无数据</div>
    </div>
  );
}

function formatNumber(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "--";
  }
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(value);
}

function formatPrice(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "--";
  }
  return value.toFixed(4);
}

function getStatusLabel(record: RecoveryListingRecord) {
  if (record.status === "ONLINE") {
    return "回收中";
  }
  if (record.remainingRecoveryAmount <= 0 && record.recoveryTotalAmount > 0) {
    return "已回收完";
  }
  return "已下架";
}

function FilterCard({
  query,
  onChange,
  onReset,
}: {
  query: RecoveryListingQuery;
  onChange: (nextQuery: RecoveryListingQuery) => void;
  onReset: () => void;
}) {
  return (
    <section className="h-[72px] rounded-[4px] bg-white shadow-[0_2px_12px_0_rgba(0,0,0,0.06)]">
      <div className="flex h-full items-center gap-[32px] px-5">
        <div className="flex items-center gap-6">
          <span className="whitespace-nowrap text-[15px] font-semibold text-[#303133]">做市商</span>
          <SelectBox value={MARKET_MAKER_NAME} disabled className="w-[220px]" />
        </div>

        <div className="flex items-center gap-6">
          <span className="whitespace-nowrap text-[15px] font-semibold text-[#303133]">资产名称</span>
          <SelectBox
            value={query.assetName}
            placeholder="请选择"
            className="w-[213px]"
            onChange={(assetName) => onChange({ ...query, assetName, page: 1 })}
          />
        </div>

        <div className="flex items-center gap-6">
          <span className="whitespace-nowrap text-[15px] font-semibold text-[#303133]">状态</span>
          <SelectBox
            value={query.status === "ALL" ? "" : query.status}
            placeholder="请选择"
            options={statusOptions.filter((option) => option.value !== "ALL")}
            className="w-[220px]"
            onChange={(status) =>
              onChange({ ...query, status: status ? (status as RecoveryListingStatus) : "ALL", page: 1 })
            }
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button type="button" className={`${outlineButtonClassName} w-16`} onClick={onReset}>
            重 置
          </button>
          <button type="button" className={`${primaryButtonClassName} w-16`} onClick={() => onChange({ ...query })}>
            查 询
          </button>
        </div>
      </div>
    </section>
  );
}

function ListingTableCard({
  records,
  loading,
  onOpenConfig,
}: {
  records: RecoveryListingRecord[];
  loading: boolean;
  onOpenConfig: () => void;
}) {
  const columns = [
    "做市商",
    "资产名称",
    "可回收额度",
    "回收总量",
    "剩余可回收",
    "已回收",
    "回收价格",
    "状态",
    "更新时间",
    "操作",
  ];

  return (
    <section className="mt-4 min-h-[306px] rounded-[4px] bg-white shadow-[0_2px_12px_0_rgba(0,0,0,0.07)]">
      <div className="px-5 pb-10 pt-[28px]">
        <div className="flex items-start justify-between">
          <p className="pt-[2px] text-[15px] font-semibold text-[#606266]">
            当前做市商：
            <span className="text-[#303133]">{MARKET_MAKER_NAME}</span>
          </p>
          <button
            type="button"
            onClick={onOpenConfig}
            className="h-[36px] w-[92px] rounded-[6px] bg-[#2b58d8] text-[15px] font-semibold leading-9 text-white shadow-[0_0_0_4px_rgba(47,128,237,0.45),0_1px_2px_rgba(43,88,216,0.18)] transition hover:bg-[#2b58d8]"
          >
            回收配置
          </button>
        </div>

        <div className="mt-2 overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="h-[47px] bg-[#fbfbfb] text-[15px] font-semibold text-[#1f2329]">
                {columns.map((column, index) => (
                  <th
                    key={column}
                    className="border-b border-[#ececec] px-2 font-semibold first:pl-2"
                    style={{ width: index === 0 ? "12%" : index === 1 ? "13%" : undefined }}
                  >
                    <span
                      className={`block leading-[22px] ${
                        index === columns.length - 1 ? "" : "border-r border-[#ececec]"
                      }`}
                    >
                      {column}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id} className="h-[54px] text-[14px] text-[#606266]">
                    <td className="border-b border-[#ececec] px-2">{record.marketMakerName || "--"}</td>
                    <td className="border-b border-[#ececec] px-2">{record.assetName || "--"}</td>
                    <td className="border-b border-[#ececec] px-2">
                      {formatNumber(record.availableRecoveryAmount)}
                    </td>
                    <td className="border-b border-[#ececec] px-2">{formatNumber(record.recoveryTotalAmount)}</td>
                    <td className="border-b border-[#ececec] px-2">
                      {formatNumber(record.remainingRecoveryAmount)}
                    </td>
                    <td className="border-b border-[#ececec] px-2">{formatNumber(record.recoveredAmount)}</td>
                    <td className="border-b border-[#ececec] px-2">{formatPrice(record.recoveryPrice)}</td>
                    <td className="border-b border-[#ececec] px-2">{getStatusLabel(record)}</td>
                    <td className="border-b border-[#ececec] px-2">{record.updatedAt || "--"}</td>
                    <td className="border-b border-[#ececec] px-2">--</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="border-b border-[#ececec]">
                    <EmptyState loading={loading} />
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

function RecoveryConfigModal({
  open,
  assets,
  onClose,
}: {
  open: boolean;
  assets: RecoveryAssetOption[];
  onClose: () => void;
}) {
  const searchParams = useSearchParams();
  const roleQuery = searchParams.get("role");
  const viewer = useMemo(() => getRecoveryCurrentViewer(roleQuery), [roleQuery]);
  const { showWarningToast } = useGlobalFeedback();
  const [assetId, setAssetId] = useState("");
  const [recoveryTotalAmount, setRecoveryTotalAmount] = useState("");
  const [recoveryPrices, setRecoveryPrices] =
    useState<Record<RecoveryPriceCurrency, string>>(defaultRecoveryPrices);
  const [status, setStatus] = useState<RecoveryListingStatus | "">("");
  const [saving, setSaving] = useState(false);

  if (!open) {
    return null;
  }

  async function handleSubmit() {
    const numericTotal = Number(recoveryTotalAmount);

    if (!MARKET_MAKER_NAME) {
      showWarningToast("请选择做市商");
      return;
    }
    if (!assetId) {
      showWarningToast("请选择资产名称");
      return;
    }
    if (!recoveryTotalAmount || Number.isNaN(numericTotal) || numericTotal <= 0) {
      showWarningToast("请输入大于 0 的回收总量");
      return;
    }
    for (const currency of priceCurrencies) {
      const price = Number(recoveryPrices[currency]);
      if (!recoveryPrices[currency] || Number.isNaN(price) || price <= 0) {
        showWarningToast(`请输入大于 0 的 ${currency} 价格`);
        return;
      }
    }
    if (!status) {
      showWarningToast("请选择状态");
      return;
    }

    setSaving(true);
    try {
      await saveRecoveryListing(
        {
          assetId,
          recoveryTotalAmount: numericTotal,
          recoveryPrices: {
            USDT: Number(recoveryPrices.USDT),
            USDC: Number(recoveryPrices.USDC),
            USD1: Number(recoveryPrices.USD1),
          },
          status,
        },
        viewer
      );
    } catch (error) {
      showWarningToast(error instanceof Error ? error.message : "回收上架接口暂未接入");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/48 pt-[100px]">
      <div className="relative flex h-[598px] w-[520px] flex-col rounded-[5px] bg-white shadow-[0_20px_48px_rgba(0,0,0,0.18)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-[20px] top-[21px] grid size-7 place-items-center text-[#909399]"
          aria-label="关闭"
        >
          <X className="size-5 stroke-[2]" />
        </button>

        <div className="px-12 pt-[38px]">
          <h2 className="text-[20px] font-semibold leading-[28px] text-[#303133]">回收配置</h2>
        </div>
        <div className="mx-6 mt-3 h-px bg-[#e9e9e9]" />

        <div className="min-h-0 flex-1 overflow-y-auto px-12 py-[26px]">
          <div className="space-y-[22px]">
            <div className="space-y-[11px]">
              <FormLabel required>做市商</FormLabel>
              <SelectBox value={MARKET_MAKER_NAME} disabled className="w-full" />
            </div>

            <div className="space-y-[11px]">
              <FormLabel required>资产名称</FormLabel>
              <SelectBox
                value={assetId}
                placeholder="请选择资产"
                className="w-full"
                options={assets.map((asset) => ({ value: asset.id, label: asset.name }))}
                onChange={setAssetId}
              />
            </div>

            <div className="space-y-[11px]">
              <FormLabel required>回收总量</FormLabel>
              <TextInput value={recoveryTotalAmount} placeholder="请输入" onChange={setRecoveryTotalAmount} />
            </div>

            <div className="space-y-[11px]">
              <FormLabel required>状态</FormLabel>
              <SelectBox
                value={status}
                placeholder="请选择状态"
                className="w-full"
                options={statusOptions.filter((option) => option.value !== "ALL")}
                onChange={(nextStatus) => setStatus(nextStatus as RecoveryListingStatus)}
              />
            </div>

            <div className="space-y-[11px]">
              <FormLabel required>配置回收价格</FormLabel>
              <div className="space-y-2 rounded-[4px] border border-[#ebeef5] bg-[#fbfcff] p-3">
                {priceCurrencies.map((currency) => (
                  <div key={currency} className="grid grid-cols-[minmax(0,1fr)_56px] items-center gap-3">
                    <TextInput
                      value={recoveryPrices[currency]}
                      placeholder="请输入"
                      onChange={(price) => setRecoveryPrices((current) => ({ ...current, [currency]: price }))}
                    />
                    <span className="text-[14px] font-semibold leading-8 text-[#606266]">{currency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e9e9e9] px-12 py-[25px]">
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
              onClick={handleSubmit}
              disabled={saving}
              className={`${primaryButtonClassName} w-[88px] disabled:opacity-60`}
            >
              确定回收
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecoveryListingPage({ initialConfigOpen = false }: { initialConfigOpen?: boolean }) {
  const searchParams = useSearchParams();
  const roleQuery = searchParams.get("role");
  const viewer = useMemo(() => getRecoveryCurrentViewer(roleQuery), [roleQuery]);
  const [query, setQuery] = useState<RecoveryListingQuery>(() => createDefaultRecoveryQuery(viewer));
  const [records, setRecords] = useState<RecoveryListingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<RecoveryAssetOption[]>([]);
  const [configOpen, setConfigOpen] = useState(initialConfigOpen);

  useEffect(() => {
    setQuery(createDefaultRecoveryQuery(viewer));
  }, [viewer]);

  useEffect(() => {
    let active = true;

    void (async () => {
      setLoading(true);
      try {
        const result = await queryRecoveryListings(query, viewer);
        if (active) {
          setRecords(result.items);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [query, viewer]);

  useEffect(() => {
    if (!configOpen) {
      return;
    }

    let active = true;

    void (async () => {
      const list = await getRecoveryAssets({
        viewer,
        marketMakerId: viewer.role === "marketMaker" ? viewer.marketMakerId : undefined,
      });
      if (active) {
        setAssets(list);
      }
    })();

    return () => {
      active = false;
    };
  }, [configOpen, viewer]);

  return (
    <div className="w-full">
      <div className="mb-[10px] flex items-center gap-[10px] text-[15px] font-semibold leading-[22px]">
        <span className="text-[#909399]">做市上架</span>
        <span className="text-[#909399]">/</span>
        <span className="text-[#303133]">回收上架</span>
      </div>

      <FilterCard query={query} onChange={setQuery} onReset={() => setQuery(createDefaultRecoveryQuery(viewer))} />
      <ListingTableCard records={records} loading={loading} onOpenConfig={() => setConfigOpen(true)} />
      <RecoveryConfigModal open={configOpen} assets={assets} onClose={() => setConfigOpen(false)} />

      <span className="sr-only">当前角色：{viewer.role}</span>
    </div>
  );
}
