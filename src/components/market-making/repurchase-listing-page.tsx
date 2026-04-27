"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGlobalFeedback } from "@/components/feedback/global-feedback-provider";
import {
  createDefaultRepurchaseQuery,
  exportRepurchaseListings,
  getRepurchaseCurrentViewer,
  getRepurchaseMarketMakers,
  offlineRepurchaseListing,
  queryRepurchaseListings,
} from "@/services/market-making.service";
import type {
  RepurchaseListingPageResult,
  RepurchaseListingQuery,
  RepurchaseListingRecord,
  RepurchaseMarketMakerOption,
  RepurchaseViewerContext,
} from "@/lib/market-making/types";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatListedPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatListedPrices(items: RepurchaseListingRecord["listedPrices"]) {
  return items.map((item) => `${item.stablecoin} ${formatListedPrice(item.price)}`).join(" / ");
}

function Pagination({
  page,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 5);

  return (
    <div className="flex items-center justify-end gap-2 text-[12px] text-[#606266]">
      <button
        type="button"
        className="rounded-[2px] border border-[#dcdfe6] bg-white px-3 py-1 transition hover:border-[#c0c4cc] disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        上一页
      </button>
      <span className="text-[#909399]">共{total}条</span>
      {pages.map((item) => (
        <button
          key={item}
          type="button"
          className={`min-w-6 rounded-[2px] border px-2 py-1 transition ${
            item === page
              ? "border-[#2f80ed] bg-[#2f80ed] text-white"
              : "border-[#dcdfe6] bg-white text-[#606266] hover:border-[#c0c4cc]"
          }`}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
      <button
        type="button"
        className="rounded-[2px] border border-[#dcdfe6] bg-white px-3 py-1 transition hover:border-[#c0c4cc] disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
      >
        下一页
      </button>
    </div>
  );
}

function DataTable({
  items,
  loading,
  viewer,
  onOffline,
  offliningId,
}: {
  items: RepurchaseListingRecord[];
  loading: boolean;
  viewer: RepurchaseViewerContext;
  onOffline: (id: string) => void;
  offliningId: string | null;
}) {
  const showMarketMakerColumn = viewer.role === "admin";
  const columns = showMarketMakerColumn
    ? ["做市商", "资产名称", "可上架", "上架总量", "已售", "在售", "上架价格", "状态", "更新时间", "操作"]
    : ["资产名称", "可上架", "上架总量", "已售", "在售", "上架价格", "状态", "更新时间", "操作"];

  return (
    <div className="overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-white text-[12px] text-[#303133]">
            {columns.map((title) => (
              <th key={title} className="px-4 py-3 text-left font-normal">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white text-[13px] text-[#303133]">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-14 text-center text-[#909399]">
                列表加载中...
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-14 text-center text-[#909399]">
                暂无数据
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const remaining = Math.max(item.listedQuantity - item.soldQuantity, 0);
              const soldOut = item.listedQuantity > 0 && remaining === 0;
              const statusLabel =
                item.status === "ONLINE" ? "已上架" : soldOut ? "已下架（售完）" : "已下架";
              const canOffline = item.status === "ONLINE";
              return (
                <tr key={item.id} className="border-t border-[#ebeef5]">
                  {showMarketMakerColumn ? <td className="px-4 py-6">{item.marketMakerName}</td> : null}
                  <td className="px-4 py-6">{item.assetName}</td>
                  <td className="px-4 py-6">{formatPrice(item.availableQuantity)}</td>
                  <td className="px-4 py-6">{formatPrice(item.listedQuantity)}</td>
                  <td className="px-4 py-6">{formatPrice(item.soldQuantity)}</td>
                  <td className="px-4 py-6">
                    {soldOut ? (
                      <span className="text-[#e89138]">0（已售完）</span>
                    ) : (
                      formatPrice(remaining)
                    )}
                  </td>
                  <td className="px-4 py-6">{formatListedPrices(item.listedPrices)}</td>
                  <td className="px-4 py-6">
                    <span className={item.status === "ONLINE" ? "text-[#18a957]" : "text-[#909399]"}>
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-4 py-6">{item.updatedAt}</td>
                  <td className="px-4 py-6">
                    {canOffline ? (
                      <button
                        type="button"
                        className="text-[#2f8bff] transition hover:text-[#6aa8ff] disabled:cursor-not-allowed disabled:text-[#c0c4cc]"
                        onClick={() => onOffline(item.id)}
                        disabled={offliningId === item.id}
                      >
                        {offliningId === item.id ? "下架中..." : "下架"}
                      </button>
                    ) : (
                      <span className="text-[#c0c4cc]">—</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export function RepurchaseListingPage() {
  const searchParams = useSearchParams();
  const { showErrorToast, showSuccessToast } = useGlobalFeedback();
  const [viewer, setViewer] = useState<RepurchaseViewerContext | null>(null);
  const [query, setQuery] = useState<RepurchaseListingQuery | null>(null);
  const [filters, setFilters] = useState<RepurchaseListingQuery | null>(null);
  const [marketMakers, setMarketMakers] = useState<RepurchaseMarketMakerOption[]>([]);
  const [result, setResult] = useState<RepurchaseListingPageResult>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [offliningId, setOffliningId] = useState<string | null>(null);

  const roleQuery = searchParams.get("role");
  const roleSuffix = useMemo(() => {
    const resolvedRole = roleQuery === "marketMaker" ? "marketMaker" : "admin";
    return `?role=${resolvedRole}`;
  }, [roleQuery]);

  useEffect(() => {
    const nextViewer = getRepurchaseCurrentViewer(roleQuery);
    setViewer(nextViewer);
    const defaultQuery = createDefaultRepurchaseQuery(nextViewer);
    setQuery(defaultQuery);
    setFilters(defaultQuery);
  }, [roleQuery]);

  useEffect(() => {
    if (!viewer) {
      return;
    }

    void (async () => {
      try {
        const nextMarketMakers = await getRepurchaseMarketMakers(viewer);
        setMarketMakers(nextMarketMakers);
      } catch {
        showErrorToast("做市商加载失败，请稍后重试");
      }
    })();
  }, [viewer, showErrorToast]);

  const loadData = useCallback(
    async (nextQuery: RepurchaseListingQuery, nextViewer: RepurchaseViewerContext) => {
      setLoading(true);
      try {
        const nextResult = await queryRepurchaseListings(nextQuery, nextViewer);
        setResult(nextResult);
      } catch {
        showErrorToast("列表加载失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    },
    [showErrorToast]
  );

  useEffect(() => {
    if (!viewer || !query) {
      return;
    }

    void loadData(query, viewer);
  }, [loadData, query, viewer]);

  const handleOffline = useCallback(
    async (id: string) => {
      if (!viewer || !query) {
        return;
      }

      const confirmed = window.confirm("确认下架该条上架记录？下架后买方将不再看到此挂单。");
      if (!confirmed) {
        return;
      }

      setOffliningId(id);
      try {
        const nextRecord = await offlineRepurchaseListing(id, viewer);
        setResult((current) => {
          const matchesFilter =
            query.status === "ALL" || query.status === nextRecord.status;
          if (!matchesFilter) {
            return {
              items: current.items.filter((item) => item.id !== id),
              total: Math.max(current.total - 1, 0),
            };
          }
          return {
            ...current,
            items: current.items.map((item) => (item.id === id ? nextRecord : item)),
          };
        });
        showSuccessToast("已下架");
      } catch (error) {
        const message = error instanceof Error ? error.message : "下架失败，请稍后重试";
        showErrorToast(message);
      } finally {
        setOffliningId(null);
      }
    },
    [viewer, query, showSuccessToast, showErrorToast]
  );

  if (!viewer || !query || !filters) {
    return (
      <div className="max-w-[1200px] space-y-4">
        <div className="space-y-1 px-1">
          <p className="text-[13px] text-[#909399]">做市上架 / 回购上架</p>
          <h1 className="text-[22px] font-semibold text-[#303133]">回购上架</h1>
        </div>
        <section className="rounded-[2px] border border-[#ebeef5] bg-white px-4 py-12 text-center text-[14px] text-[#909399] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          页面初始化中...
        </section>
      </div>
    );
  }

  const showMarketMakerFilter = viewer.role === "admin";
  const showExportButton = viewer.role === "admin";

  return (
    <div className="max-w-[1200px] space-y-4">
      <div className="space-y-1 px-1">
        <p className="text-[13px] text-[#909399]">做市上架 / 回购上架</p>
        <h1 className="text-[22px] font-semibold text-[#303133]">回购上架</h1>
      </div>

      <section className="overflow-hidden rounded-[2px] border border-[#ebeef5] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="space-y-5 px-4 py-5">
          <div className="flex flex-wrap items-start gap-3">
            {showMarketMakerFilter ? (
              <select
                value={filters.marketMakerId}
                onChange={(event) => setFilters((current) => (current ? { ...current, marketMakerId: event.target.value } : current))}
                className="h-9 w-[180px] rounded-[2px] border-0 bg-white px-3 text-sm text-black outline-none"
              >
                <option value="">全部做市商</option>
                {marketMakers.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            ) : null}
            <Input
              value={filters.assetName}
              onChange={(event) => setFilters((current) => (current ? { ...current, assetName: event.target.value } : current))}
              placeholder="资产名称"
              className="h-9 w-[260px] rounded-[2px] border-0 bg-white text-sm text-black shadow-none placeholder:text-[#909399]"
            />
            <select
              value={filters.status}
              onChange={(event) =>
                setFilters((current) =>
                  current
                    ? {
                        ...current,
                        status: event.target.value as RepurchaseListingQuery["status"],
                      }
                    : current
                )
              }
              className="h-9 w-[160px] rounded-[2px] border-0 bg-white px-3 text-sm text-black outline-none"
            >
              <option value="ALL">全部</option>
              <option value="ONLINE">已上架</option>
              <option value="OFFLINE">已下架</option>
            </select>

            <div className="ml-auto flex flex-wrap items-center gap-3">
              <Button
                className="h-9 rounded-[2px] bg-[#2f80ed] px-6 text-[13px] font-normal text-white shadow-none hover:bg-[#1766cf]"
                onClick={() => setQuery({ ...filters, page: 1, pageSize: query.pageSize })}
              >
                <Search className="size-3.5" />
                查询
              </Button>
              <Button
                variant="outline"
                className="h-9 rounded-[2px] border-0 bg-white px-6 text-[13px] font-normal text-black shadow-none hover:bg-[#f3f4f6]"
                onClick={() => {
                  const nextFilters = createDefaultRepurchaseQuery(viewer);
                  setFilters(nextFilters);
                  setQuery(nextFilters);
                }}
              >
                重置
              </Button>
              {showExportButton ? (
                <Button
                  className="h-9 rounded-[2px] bg-[#18a957] px-6 text-[13px] font-normal text-white shadow-none hover:bg-[#138948]"
                  disabled={exporting}
                  onClick={async () => {
                    setExporting(true);
                    try {
                      await exportRepurchaseListings(query, viewer);
                      showSuccessToast("导出成功");
                    } catch {
                      showErrorToast("导出失败，请稍后重试");
                    } finally {
                      setExporting(false);
                    }
                  }}
                >
                  <Download className="size-3.5" />
                  导出
                </Button>
              ) : null}
              <Button
                asChild
                className="h-9 rounded-[2px] bg-[#2f80ed] px-6 text-[13px] font-normal text-white shadow-none hover:bg-[#1766cf]"
              >
                <Link href={`/backEnd/marketMaking/repurchase/config${roleSuffix}`}>上架配置</Link>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[12px] text-[#909399]">
              数量口径说明：当前可继续上架数量 = 当前库存扣除当前在售数量后的可继续配置数量；当前在售数量 = 累计上架数量 - 已售数量。
            </p>
            <DataTable
              items={result.items}
              loading={loading}
              viewer={viewer}
              onOffline={handleOffline}
              offliningId={offliningId}
            />
            <Pagination
              page={query.page}
              total={result.total}
              pageSize={query.pageSize}
              onChange={(page) => setQuery((current) => (current ? { ...current, page } : current))}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
